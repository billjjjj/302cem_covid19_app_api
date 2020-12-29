const request = require('supertest');
const dayjs = require('dayjs');
const mongoose = require('../../database/test.mongodb.connect');
const app = require('../../app');
const AreaModel = require('../../models/area.model');
// mock data
const newUser = require('../mock-data/user/new-user.json');
const newArea = require('../mock-data/area/new-area.json');
const allAreas = require('../mock-data/area/all-areas.json');
// testing detail
const endpointUrl = '/areas/';
const nonExistingAreaId = '5fe313b9c8acc928ceaee2ba';
const testData = {
  district: 'Tsuen Wan',
  buildingName: 'Wai Tsuen Sports Centre',
  lastDate: '2020-12-30',
  caseNo: 7795,
};

dayjs.locale('zh-hk');
let firstArea;
let newAreaId;
let config;

describe(endpointUrl, () => {
  beforeAll(async () => {
    await AreaModel.deleteMany({});
    await AreaModel.create(allAreas);
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
    expect(response.body[0].district).toBeDefined();
    expect(response.body[0].buildingName).toBeDefined();
    expect(response.body[0].caseNo).toBeDefined();
    expect(response.body[0].lastDate).toBeDefined();
    [firstArea] = response.body;
  });

  test(`GET by Id ${endpointUrl} :areaId`, async () => {
    const response = await request(app).get(endpointUrl + firstArea._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstArea.title);
    expect(response.body.done).toBe(firstArea.done);
  });

  test(`GET area by id doesn't exist ${endpointUrl} ':areaId'`, async () => {
    const response = await request(app).get(endpointUrl + nonExistingAreaId);
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newArea);
    expect(response.statusCode).toBe(201);
    expect(response.body.buildingName).toBe(newArea.buildingName);
    expect(response.body.district).toBe(newArea.district);
    expect(response.body.caseNo).toBe(newArea.caseNo);

    newAreaId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newArea, buildingName: '' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:
        'Area validation failed: buildingName: Path `buildingName` is required.',
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newAreaId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.buildingName).toBe(testData.buildingName);
    expect(res.body.district).toBe(testData.district);
    expect(res.body.caseNo).toBe(testData.caseNo);
  });

  test('HTTP DELETE', async () => {
    const res = await request(app)
      .delete(endpointUrl + newAreaId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.buildingName).toBe(testData.buildingName);
  });

  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingAreaId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
