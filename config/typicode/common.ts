import * as dotenv from 'dotenv';

dotenv.config();

export const commonConfig = {
    baseUrl: process.env.TYPICODE_BASE_URL!,
};