import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { Client as FTPClient } from 'basic-ftp';
import { CONFIG_DATABASE_URL, CONFIG_DB_BACKUP_KEY, CONFIG_FTP_HOST, CONFIG_FTP_PASSWORD, CONFIG_FTP_USER, CONFIG_SERVER_MODE } from '../../config.js';
import { spawn, spawnSync } from 'child_process';
import { pipeline } from 'stream/promises';


type URL_TYPE = {
    href: string,
    origin: string,
    protocol: string,
    username: string,
    password: string,
    host: string,
    hostname: string,
    port: string,
    pathname: string,
    search: '',
    searchParams: {},
    hash: ''
}

const plainFileName = 'db-backup.sql';
const encryptedFileName = 'db-backup.sql.enc';
const ALGO = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(CONFIG_DB_BACKUP_KEY)).digest(); // 32 bytes
const IV_LENGTH = 16;
const dbUrlObject: URL_TYPE = new URL(CONFIG_DATABASE_URL!) as unknown as URL_TYPE

export const encryptFile = async (inputPath: string, outputPath: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, ENCRYPTION_KEY, iv);

    const inputStream = fs.createReadStream(inputPath);
    const outputStream = fs.createWriteStream(outputPath);

    // Write IV first so we can retrieve it during decryption
    outputStream.write(iv);

    // Pipe input through cipher into output
    await pipeline(inputStream, cipher, outputStream);

    console.log(`Encrypted file saved to: ${outputPath}`);
};


const decryptFile = async (encryptedPath: string, outputPath: string = 'someting.sql') => {
    const encryptedData = await fs.promises.readFile(encryptedPath);

    // The IV is stored in the first 16 bytes of the file
    const iv = encryptedData.subarray(0, 16);
    const encryptedContent = encryptedData.subarray(16);

    const decipher = crypto.createDecipheriv(
        ALGO,
        ENCRYPTION_KEY,
        iv
    );

    const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
    ]);

    await fs.promises.writeFile(outputPath, decrypted);
    console.log(`[✔] File decrypted → ${outputPath}`);
}


interface RestoreOptions {
    dbUrl: string; // e.g. process.env.DATABASE_URL
    dumpFile: string; // path to decrypted .sql file
}


const restoreDatabase = async ({ dbUrl, dumpFile }: RestoreOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(dumpFile);

        if (!fs.existsSync(absolutePath)) {
            return reject(new Error(`Dump file not found: ${absolutePath}`));
        }

        console.log(' resotre db host >>>>  ', dbUrlObject.host)

        spawnSync("createdb", ["-h", dbUrlObject.host, "-U", dbUrlObject.username, "cart2door"], {
            stdio: "inherit",
            env: { ...process.env, PGPASSWORD: dbUrlObject.password },
        });

        // Spawn psql process
        const psql = spawn("psql", [dbUrl], {
            stdio: ["pipe", "inherit", "inherit"], // stdin from file, rest inherited
        });

        // Pipe dump file into psql stdin
        const readStream = fs.createReadStream(absolutePath);
        readStream.pipe(psql.stdin);

        psql.on("close", (code) => {
            if (code === 0) {
                logger.info('[✔ CRON] - restoreDatabase: Success')
                resolve();
            } else {
                reject(new Error(`psql exited with code ${code}`));
            }
        });

        psql.on("error", (err) => reject(err));
    });
}



const backupDB = async () => {
    const ftpclient = new FTPClient();

    try {

        const user = dbUrlObject.username;
        const password = dbUrlObject.password;
        const host = dbUrlObject.hostname;
        const port = dbUrlObject.port || '5432';
        const dbName = dbUrlObject.pathname.slice(1); // remove leading slash


        const dir = path.join(process.cwd(), 'backups'); // Safe folder inside project
        await fs.promises.mkdir(dir, { recursive: true });
        const plainFilePath = path.join(dir, plainFileName);
        const encryptedFilePath = path.join(dir, encryptedFileName)


        await new Promise<void>((resolve, reject) => {
            const dump = spawn('pg_dump', [
                '-U', user,
                '-h', host,
                '-p', port,
                '-d', dbName
            ], {
                env: { ...process.env, PGPASSWORD: password }
            })


            const out = fs.createWriteStream(plainFilePath)
            dump.stdout.pipe(out);

            dump.stderr.on('data', (data) => {
                console.error('pg_dump stderr:', data.toString());
            });

            dump.on('close', (code) => {
                if (code === 0) {
                    logger.info('[> CRON] - backupDB: Dump success');
                    resolve();
                }
                else reject(new Error(`pg_dump failed with code ${code}`));
            });
        })


        await encryptFile(plainFilePath, encryptedFilePath);


        // Upload to FTP
        await ftpclient.access({
            host: CONFIG_FTP_HOST,
            user: CONFIG_FTP_USER,
            password: CONFIG_FTP_PASSWORD,
            secure: false,
        });
        await ftpclient.ensureDir(`${CONFIG_SERVER_MODE}-backups`);
        await ftpclient.uploadFrom(encryptedFilePath, encryptedFileName);


        logger.info('[✔ CRON] - backupDB: Success')
    } catch (error) {
        console.log(error);

        logger.error(`[x CRON] - backupDB: Start, ${JSON.stringify(error)}`)
    } finally {
        ftpclient.close();
    }
};



export const restoreBackup = async (filename: string) => {
    logger.info('[✔ CRON]: restoreBackup - start');
    const ftpclient = new FTPClient();

    try {
        // GET Backup from FTP
        await ftpclient.access({
            host: CONFIG_FTP_HOST,
            user: CONFIG_FTP_USER,
            password: CONFIG_FTP_PASSWORD,
            secure: false,
        });

        await ftpclient.cd(`${CONFIG_SERVER_MODE}-backups`);

        const localEncryptedPath = path.join(process.cwd(), 'backups', `ftp-${filename}`);
        await fs.promises.mkdir(path.dirname(localEncryptedPath), { recursive: true });

        await ftpclient.downloadTo(localEncryptedPath, filename);


        // Decrypt Backup
        const decryptedPath = localEncryptedPath.replace('.enc', '.sql');
        await decryptFile(localEncryptedPath, decryptedPath);


        // Restore Database
        await restoreDatabase({
            dbUrl: CONFIG_DATABASE_URL!,
            dumpFile: decryptedPath
        })

        logger.info(`[✔ CRON]: restoreBackup - to → ${decryptedPath}`);
    } catch (err) {
        console.error('[x CRON]: restoreBackup:', err);
    } finally {
        ftpclient.close();
    }
}



export const startDBBackUp = () => {
    cron.schedule('* * * * *', async () => {
        logger.info('[CRON] - backupDB: Start')
        // await backupDB();

        await restoreBackup(encryptedFileName);
        // setTimeout(async () => {
        // }, 350000)
    });
}


