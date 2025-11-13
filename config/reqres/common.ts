import * as dotenv from 'dotenv';

dotenv.config();

export const commonConfig = {
    baseUrl: process.env.REQRES_BASE_URL!,
};