const request = require('supertest');
const mongoose = require('../../database/test.mongodb.connect');
const app = require('../../app');
const CaseMoel = require('../../models/case.model');
// mock data
const newUser = require('../mock-data/user/new-user.json');
const newCase = require('../mock-data/case/new-case.json');
const allCase = require('../mock-data/case/all-cases.json');
// testing detail
const endpointUrl = '/cases/';
const nonExistingCaseId = '5fe313b9c8acc928ceaee2ba';
const testData = {
  title: 'Make integration test for PUT',
  description: 'description integration test',
};

let firstCase;
let newCaseId;
let config;

describe(endpointUrl, () => {
  beforeAll(async () => {
    await CaseMoel.deleteMany({});
    await CaseMoel.create(allCase);
    // Login
    const res = await request(app)
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    config = {
      Authorization: `Bearer ${res.body.token}`,
    };
  });

  afterEach(async () => {});

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    [firstCase] = response.body;
  });

  test(`GET by Id ${endpointUrl} :caseId`, async () => {
    const response = await request(app).get(endpointUrl + firstCase._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstCase.title);
    expect(response.body.done).toBe(firstCase.done);
  });

  test(`GET case by id doesn't exist ${endpointUrl} ':caseId'`, async () => {
    const response = await request(app).get(endpointUrl + nonExistingCaseId);
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newCase);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newCase.title);
    expect(response.body.description).toBe(newCase.description);
    newCaseId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ title: 'Missing done property' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:
        'Case validation failed: description: Path `description` is required.',
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newCaseId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
  });

  test('HTTP DELETE', async () => {
    const res = await request(app)
      .delete(endpointUrl + newCaseId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
  });

  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingCaseId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
