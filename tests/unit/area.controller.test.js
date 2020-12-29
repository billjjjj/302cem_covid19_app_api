const httpMocks = require('node-mocks-http');
const AreaModel = require('../../models/area.model');
const AreaController = require('../../controllers/AreaController');

const areaController = new AreaController(AreaModel);

const newRule = require('../mock-data/rule/new-rule.json');
const allRules = require('../mock-data/rule/all-rules.json');

jest.mock('../../models/area.model');

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
describe('areaController.getAllEntities', () => {
  it('should have a getTodos function', () => {
    expect(typeof areaController.getAllEntities).toBe('function');
  });
  it('should call AreaModel.find({})', async () => {
    await areaController.getAllEntities(req, res, next);
    expect(AreaModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    AreaModel.find.mockReturnValue(allRules);
    await areaController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allRules);
  });
  it('should handle errors in getAllEntities', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    AreaModel.find.mockReturnValue(rejectedPromise);
    await areaController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('areaController.getEntityById', () => {
  it('should have a.getEntityById', () => {
    expect(typeof areaController.getEntityById).toBe('function');
  });
  it('should call AreaModel.findById with route parameters', async () => {
    req.params.id = ruleId;
    await areaController.getEntityById(req, res, next);
    expect(AreaModel.findById).toBeCalledWith(ruleId);
  });
  it('should return json body and response code 200', async () => {
    AreaModel.findById.mockReturnValue(newRule);
    await areaController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding AreaModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    AreaModel.findById.mockReturnValue(rejectedPromise);
    await areaController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should return 404 when item doesnt exist', async () => {
    AreaModel.findById.mockReturnValue(null);
    await areaController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Create Rule
 */
describe('areaController.createEntity', () => {
  beforeEach(() => {
    req.body = newRule;
  });

  it('should have a.createEntity function', () => {
    expect(typeof areaController.createEntity).toBe('function');
  });
  it('should call AreaModel.create', () => {
    areaController.createEntity(req, res, next);
    expect(AreaModel.create).toBeCalledWith(newRule);
  });
  it('should return 201 response code', async () => {
    await areaController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    AreaModel.create.mockReturnValue(newRule);
    await areaController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newRule);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    AreaModel.create.mockReturnValue(rejectedPromise);
    await areaController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Rule
 */
describe('areaController.updateEntityById', () => {
  it('should have a updateEntityById function', () => {
    expect(typeof areaController.updateEntityById).toBe('function');
  });
  it('should update with AreaModel.findByIdAndUpdate', async () => {
    req.params.id = ruleId;
    req.body = newRule;
    await areaController.updateEntityById(req, res, next);

    expect(AreaModel.findByIdAndUpdate).toHaveBeenCalledWith(ruleId, newRule, {
      new: true,
      useFindAndModify: false,
    });
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = ruleId;
    req.body = newRule;
    AreaModel.findByIdAndUpdate.mockReturnValue(newRule);
    await areaController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    AreaModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await areaController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Rule
 */
describe('areaController.deleteEntityById', () => {
  it('should have a deleteEntityById function', () => {
    expect(typeof areaController.deleteEntityById).toBe('function');
  });
  it('should call findByIdAndDelete', async () => {
    req.params.id = ruleId;
    await areaController.deleteEntityById(req, res, next);
    expect(AreaModel.findByIdAndDelete).toBeCalledWith(ruleId);
  });
  it('should return 200 OK and deleted AreaModel', async () => {
    AreaModel.findByIdAndDelete.mockReturnValue(newRule);
    await areaController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newRule);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error deleting' };
    const rejectedPromise = Promise.reject(errorMessage);
    AreaModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await areaController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should handle 404', async () => {
    AreaModel.findByIdAndDelete.mockReturnValue(null);
    await areaController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
