const request = require('supertest');
const dayjs = require('dayjs');
const mongoose = require('../../database/test.mongodb.connect');
const app = require('../../app');
const RuleModel = require('../../models/rule.model');
// mock data
const newUser = require('../mock-data/user/new-user.json');
const newRule = require('../mock-data/rule/new-rule.json');
const allRules = require('../mock-data/rule/all-rules.json');
// testing detail
const endpointUrl = '/rules/';
const nonExistingRuleId = '5fe313b9c8acc928ceaee2ba';
const testData = {
  startDate: '2020-01-10',
  endDate: '2030-11-11',
  ruleName: 'Mock Rule Name1',
  description: 'Mock Description1',
};

dayjs.locale('zh-hk');
let firstRule;
let newRuleId;
let config;

describe(endpointUrl, () => {
  beforeAll(async () => {
    await RuleModel.deleteMany({});
    await RuleModel.create(allRules);
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
    expect(response.body[0].startDate).toBeDefined();
    expect(response.body[0].endDate).toBeDefined();
    expect(response.body[0].ruleName).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    [firstRule] = response.body;
  });

  test(`GET by Id ${endpointUrl} :ruleId`, async () => {
    const response = await request(app).get(endpointUrl + firstRule._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstRule.title);
    expect(response.body.done).toBe(firstRule.done);
  });

  test(`GET rule by id doesn't exist ${endpointUrl} ':ruleId'`, async () => {
    const response = await request(app).get(endpointUrl + nonExistingRuleId);
    expect(response.statusCode).toBe(404);
  });

  // it(`POST ${endpointUrl}`, async () => {
  //   const response = await request(app)
  //     .post(endpointUrl)
  //     .set(config)
  //     .send(newRule);
  //   expect(response.statusCode).toBe(201);
  //   expect(response.body.ruleNo).toBe(newRule.ruleNo);
  //   expect(dayjs(response.body.reportDate).format('YYYY-MM-DD')).toBe(
  //     dayjs(newRule.reportDate).format('YYYY-MM-DD')
  //   );
  //   newRuleId = response.body._id;
  // });

  // it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
  //   const response = await request(app)
  //     .post(endpointUrl)
  //     .set(config)
  //     .send({ ...newRule, ruleNo: '' });
  //   expect(response.statusCode).toBe(500);
  //   expect(response.body).toStrictEqual({
  //     message: 'Rule validation failed: ruleNo: Path `ruleNo` is required.',
  //   });
  // });

  // it(`PUT ${endpointUrl}`, async () => {
  //   const res = await request(app)
  //     .put(endpointUrl + newRuleId)
  //     .set(config)
  //     .send(testData);
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.ruleNo).toBe(testData.ruleNo);
  //   expect(res.body.age).toBe(testData.age);
  // });

  // test('HTTP DELETE', async () => {
  //   const res = await request(app)
  //     .delete(endpointUrl + newRuleId)
  //     .set(config)
  //     .send();
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.ruleNo).toBe(testData.ruleNo);
  // });

  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingRuleId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
