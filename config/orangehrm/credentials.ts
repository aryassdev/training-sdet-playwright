import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

export const credentialConfig = {
    username: process.env.ORANGEHRM_USERNAME!,
    password: process.env.ORANGEHRM_PASSWORD!,

    wrongUsername: faker.internet.username().slice(0, 5),
    wrongPassword: faker.internet.password().slice(0, 5),
}