import * as dotenv from 'dotenv';

dotenv.config();

export const credentialConfig = {
    username: process.env.ORANGEHRM_USERNAME!,
    password: process.env.ORANGEHRM_PASSWORD!,
}