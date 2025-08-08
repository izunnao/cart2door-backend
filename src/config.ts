export const CONFIG_PORT = process.env.PORT || 4000

export const CONFIG_SERVER_MODE = process.env.MODE || "dev"

export const CONFIG_JWT_SECRET = process.env.JWT_SECRET || ""

// 
export const CONFIG_FX_RATE_MARGIN = 1.15

// DATABASE
export const CONFIG_DATABASE_URL = process.env.DATABASE_URL

// REDIS
export const CONFIG_REDIS_HOST = ''
export const CONFIG_REDIS_PORT = 3000
export const CONFIG_REDIS_PASSWORD = ''


// PAYSTACK
export const CONFIG_PAYSTACK_API_URL = 'https://api.paystack.co'
export const CONFIG_PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY



// ZEPTOMAIL
export const CONFIG_ZEPTO_SMTP_HOST = process.env.ZEPTO_SMTP_HOST
export const CONFIG_ZEPTO_SMTP_PORT = process.env.ZEPTO_SMTP_PORT
export const CONFIG_ZEPTO_SMTP_USERNAME = process.env.ZEPTO_SMTP_USERNAME
export const CONFIG_ZEPTO_SMTP_PASSWORD = process.env.ZEPTO_SMTP_PASSWORD
export const CONFIG_ZEPTO_FROM_ADDRESS = process.env.ZEPTO_FROM_ADDRESS



// CLIENT
export const CONFIG_CLIENT_BASE_URL = process.env.CLIENT_BASE_URL


// FTP
export const CONFIG_FTP_HOST = process.env.FTP_HOST
export const CONFIG_FTP_USER = process.env.FTP_USER
export const CONFIG_FTP_PASSWORD = process.env.FTP_PASSWORD


// DB
export const CONFIG_DB_BACKUP_KEY = process.env.DB_BACKUP_KEY