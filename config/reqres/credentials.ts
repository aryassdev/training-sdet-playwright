import * as dotenv from 'dotenv';

dotenv.config();

export const credentialConfig = {
    apiKey: process.env.REQRES_API_KEY,
}