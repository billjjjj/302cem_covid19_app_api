const httpMocks = require('node-mocks-http');
const RuleModel = require('../../models/rule.model');
const RuleController = require('../../controllers/RuleController');

const ruleController = new RuleController(RuleModel);

const newRule = require('../mock-data/rule/new-rule.json');
const allRules = require('../mock-data/rule/all-rules.json');

jest.mock('../../models/rule.model');

let req;
let res;
let next;
const ruleId = '5d5ecb5a6e598605f06cb945';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Rules
 */
describe('RuleController.getAllEntities', () => {
  it('should have a getTodos function', () => {
    expect(typeof ruleController.getAllEntities).toBe('function');
  });
  it('should call RuleModel.find({})', async () => {
    await ruleController.getAllEntities(req, res, next);
    expect(RuleModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    RuleModel.find.mockReturnValue(allRules);
    await ruleController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allRules);
  });
  it('should handle errors in getAllEntities', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    RuleModel.find.mockReturnValue(rejectedPromise);
    await ruleController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('RuleController.getEntityById', () => {
  it('should have a.getEntityById', () => {
    expect(typeof ruleController.getEntityById).toBe('function');
  });
  it('should call RuleModel.findById with route parameters', async () => {
    req.params.id = ruleId;
    await ruleController.getEntityById(req, res, next);
    expect(RuleModel.findById).toBeCalledWith(ruleId);
  });
  it('should return json body and response code 200', async () => {
    RuleModel.findById.mockReturnValue(newRule);
    await ruleController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding RuleModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    RuleModel.findById.mockReturnValue(rejectedPromise);
    await ruleController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should return 404 when item doesnt exist', async () => {
    RuleModel.findById.mockReturnValue(null);
    await ruleController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Create Rule
 */
describe('RuleController.createEntity', () => {
  beforeEach(() => {
    req.body = newRule;
  });

  it('should have a.createEntity function', () => {
    expect(typeof ruleController.createEntity).toBe('function');
  });
  it('should call RuleModel.create', () => {
    ruleController.createEntity(req, res, next);
    expect(RuleModel.create).toBeCalledWith(newRule);
  });
  it('should return 201 response code', async () => {
    await ruleController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    RuleModel.create.mockReturnValue(newRule);
    await ruleController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newRule);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    RuleModel.create.mockReturnValue(rejectedPromise);
    await ruleController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Rule
 */
describe('RuleController.updateEntityById', () => {
  it('should have a updateEntityById function', () => {
    expect(typeof ruleController.updateEntityById).toBe('function');
  });
  it('should update with RuleModel.findByIdAndUpdate', async () => {
    req.params.id = ruleId;
    req.body = newRule;
    await ruleController.updateEntityById(req, res, next);

    expect(RuleModel.findByIdAndUpdate).toHaveBeenCalledWith(ruleId, newRule, {
      new: true,
      useFindAndModify: false,
    });
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = ruleId;
    req.body = newRule;
    RuleModel.findByIdAndUpdate.mockReturnValue(newRule);
    await ruleController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    RuleModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await ruleController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Rule
 */
describe('RuleController.deleteEntityById', () => {
  it('should have a deleteEntityById function', () => {
    expect(typeof ruleController.deleteEntityById).toBe('function');
  });
  it('should call findByIdAndDelete', async () => {
    req.params.id = ruleId;
    await ruleController.deleteEntityById(req, res, next);
    expect(RuleModel.findByIdAndDelete).toBeCalledWith(ruleId);
  });
  it('should return 200 OK and deleted RuleModel', async () => {
    RuleModel.findByIdAndDelete.mockReturnValue(newRule);
    await ruleController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error deleting' };
    const rejectedPromise = Promise.reject(errorMessage);
    RuleModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await ruleController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should handle 404', async () => {
    RuleModel.findByIdAndDelete.mockReturnValue(null);
    await ruleController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
