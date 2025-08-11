import { LoginTicket, OAuth2Client } from "google-auth-library";
import { CONFIG_GOOGLE_CLIENT_ID } from "../config.js";

const client = new OAuth2Client(CONFIG_GOOGLE_CLIENT_ID);


export const verifyGoogleToken = async (token: string): Promise<LoginTicket> => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CONFIG_GOOGLE_CLIENT_ID,
    });

    return ticket
}




