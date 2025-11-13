import { expect, request, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { commonConfig } from '../../config/typicode/common';

test('POST - create post', async () => {
  const apiContext = await request.newContext();
  const res = await apiContext.post(`${commonConfig.baseUrl}/posts`, {
    data: {
        title: 'Hello world',
        body: 'This is a test',
        userId: 1
    }
  });

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.title).toBe('Hello world');
});

test('PUT - update post', async () => {
    const apiContext = await request.newContext();
    const res = await apiContext.put(`${commonConfig.baseUrl}/posts/1`, {
        data: {
            id: 1,
            title: 'Updated title',
            body: 'Updated body',
            userId: 1
        }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated title');
});

test('GET - list posts', async () => {
    const apiContext = await request.newContext();
    const res = await apiContext.get(`${commonConfig.baseUrl}/posts`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
});

test('POST with dynamic post data', async () => {
    const apiContext = await request.newContext();
    const title = faker.lorem.sentence();
    const bodyContent = faker.lorem.paragraph();

    const res = await apiContext.post(`${commonConfig.baseUrl}/posts`, {
        data: {
            title: title,
            body: bodyContent,
            userId: 1
        }
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe(title);
});

test('Mock GET posts with assertion', async ({ page }) => {
    // note: unable to use env config for mocking in this case
    await page.route('https://jsonplaceholder.typicode.com/posts*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{id: 999, title: 'Mock Post'}]),
        });
    });

    const response = await page.evaluate(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        return res.json();
    });

    expect(response[0].title).toBe('Mock Post');
    expect(response[0].id).toBe(999);
});

test('Mock only GET request', async ({ page }) => {
    // note: unable to use env config for mocking in this case
    await page.route('https://jsonplaceholder.typicode.com/posts*', async route => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{id: 999, title: 'Mock Post'}]),
            });
        } else {
            await route.continue();
        }
    });

    const response = await page.evaluate(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        return res.json();
    });

    expect(response[0].title).toBe('Mock Post');
    expect(response[0].id).toBe(999);
});