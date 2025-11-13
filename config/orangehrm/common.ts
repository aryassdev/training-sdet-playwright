import * as dotenv from 'dotenv';

dotenv.config();

export const commonConfig = {
    baseUrl: process.env.ORANGEHRM_BASE_URL!,
};