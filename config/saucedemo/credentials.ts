import * as dotenv from 'dotenv';

dotenv.config();

export const credentialConfig = {
    username: process.env.SAUCEDEMO_USERNAME!,
    password: process.env.SAUCEDEMO_PASSWORD!,
}