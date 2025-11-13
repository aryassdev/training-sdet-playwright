import { faker } from "@faker-js/faker";
import test, { expect } from "@playwright/test";

test('POST - create new user with job data', async ({ request }) => {
    const res = await request.post('https://reqres.in/api/users', {
        data: {
            name: 'Yvette Young',
            job: 'Guitarist'
        },
        headers: {
            'x-api-key': 'reqres-free-v1'
        }
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.name).toBe('Yvette Young');
    expect(body.job).toBe('Guitarist');
});

test('PUT - update user job info', async ({ request }) => {
    const res = await request.put('https://reqres.in/api/users/2', {
        data: {
            job: 'Pianist'
        },
        headers: {
            'x-api-key': 'reqres-free-v1'
        }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.job).toBe('Pianist');
});

test('GET - list users and validate', async ({ request }) => {
    const res = await request.get('https://reqres.in/api/users?page=2', {
        headers: {
            'x-api-key': 'reqres-free-v1'
        }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.page).toBe(2);
    expect(body.data.length).toBeGreaterThan(0);
});

const multipleCreateTest = (index: number) => test(`POST - create new user with random data: ${index}`, async ({ request }) => {
    const person = { name: faker.person.fullName(), job: faker.person.jobTitle()};
    const res = await request.post('https://reqres.in/api/users', {
        data: { name: person.name, job: person.job },
        headers: {
            'x-api-key': 'reqres-free-v1'
        }
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.name).toBe(person.name);
    expect(body.job).toBe(person.job);
});

for (let i = 0; i < 5; i++) {
    multipleCreateTest(i);
}