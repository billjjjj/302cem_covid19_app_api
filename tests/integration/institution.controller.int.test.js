const request = require('supertest');
const dayjs = require('dayjs');
const mongoose = require('../../database/test.mongodb.connect');
const app = require('../../app');
const InstitutionModel = require('../../models/institution.model');
// mock data
const newUser = require('../mock-data/user/new-user.json');
// const groupInstitutions = require('../mock-data/institution/group-institutions.json');
const newInstitutions = require('../mock-data/institution/new-institutions.json');
const allInstitutions = require('../mock-data/institution/all-institutions.json');
// testing detail
const endpointUrl = '/institutions/';
const nonExistingRuleId = '5fe313b9c8acc928ceaee2ba';
const testData = {
  region: 'Mock region Name1',
  clinic: 'Mock clinic Name1',
  address: 'Mock address Name1',
  phone: '12345678',
};

dayjs.locale('zh-hk');
let firstInstitution;
let newInstitutionId;
let config;
const group = 'group';
describe(endpointUrl, () => {
  beforeAll(async () => {
    await InstitutionModel.deleteMany({});
    await InstitutionModel.create(allInstitutions);
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
    expect(response.body[0].region).toBeDefined();
    expect(response.body[0].clinic).toBeDefined();
    expect(response.body[0].address).toBeDefined();
    expect(response.body[0].phone).toBeDefined();
    [firstInstitution] = response.body;
  });

  test(`GET ${endpointUrl}group`, async () => {
    const response = await request(app).get(endpointUrl + group);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].data).toBeDefined();
  });

  test(`GET by Id ${endpointUrl} :institutionId`, async () => {
    const response = await request(app).get(endpointUrl + firstInstitution._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.region).toBe(firstInstitution.region);
    expect(response.body.clinic).toBe(firstInstitution.clinic);
    expect(response.body.address).toBe(firstInstitution.address);
    expect(response.body.phone).toBe(firstInstitution.phone);
  });

  test(`GET institution by id doesn't exist ${endpointUrl} ':institutionId'`, async () => {
    const response = await request(app).get(endpointUrl + nonExistingRuleId);
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newInstitutions);
    expect(response.statusCode).toBe(201);
    expect(response.body.region).toBe(newInstitutions.region);
    expect(response.body.clinic).toBe(newInstitutions.clinic);
    expect(response.body.address).toBe(newInstitutions.address);
    expect(response.body.phone).toBe(newInstitutions.phone);
    newInstitutionId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newInstitutions, region: '' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:
        'Institution validation failed: region: Path `region` is required.',
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newInstitutionId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.region).toBe(testData.region);
    expect(res.body.clinic).toBe(testData.clinic);
    expect(res.body.address).toBe(testData.address);
    expect(res.body.phone).toBe(testData.phone);
  });

  test('HTTP DELETE', async () => {
    const res = await request(app)
      .delete(endpointUrl + newInstitutionId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.region).toBe(testData.region);
    expect(res.body.clinic).toBe(testData.clinic);
    expect(res.body.address).toBe(testData.address);
    expect(res.body.phone).toBe(testData.phone);
  });

  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingRuleId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
