const httpMocks = require('node-mocks-http');
const CaseModel = require('../../models/case.model');
const CaseController = require('../../controllers/CaseController');

const caseController = new CaseController(CaseModel);

const newCase = require('../mock-data/case/new-case.json');
const allCases = require('../mock-data/case/all-cases.json');

jest.mock('../../models/case.model');

let req;
let res;
let next;
const caseId = '5d5ecb5a6e598605f06cb945';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Cases
 */
describe('CaseController.getAllEntities', () => {
  it('should have a getTodos function', () => {
    expect(typeof caseController.getAllEntities).toBe('function');
  });
  it('should call CaseModel.find({})', async () => {
    await caseController.getAllEntities(req, res, next);
    expect(CaseModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    CaseModel.find.mockReturnValue(allCases);
    await caseController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allCases);
  });
  it('should handle errors in getAllEntities', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    CaseModel.find.mockReturnValue(rejectedPromise);
    await caseController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('CaseController.getEntityById', () => {
  it('should have a.getEntityById', () => {
    expect(typeof caseController.getEntityById).toBe('function');
  });
  it('should call CaseModel.findById with route parameters', async () => {
    req.params.id = caseId;
    await caseController.getEntityById(req, res, next);
    expect(CaseModel.findById).toBeCalledWith(caseId);
  });
  it('should return json body and response code 200', async () => {
    CaseModel.findById.mockReturnValue(newCase);
    await caseController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCase);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding CaseModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    CaseModel.findById.mockReturnValue(rejectedPromise);
    await caseController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should return 404 when item doesnt exist', async () => {
    CaseModel.findById.mockReturnValue(null);
    await caseController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Create Case
 */
describe('CaseController.createEntity', () => {
  beforeEach(() => {
    req.body = newCase;
  });

  it('should have a.createEntity function', () => {
    expect(typeof caseController.createEntity).toBe('function');
  });
  it('should call CaseModel.create', () => {
    caseController.createEntity(req, res, next);
    expect(CaseModel.create).toBeCalledWith(newCase);
  });
  it('should return 201 response code', async () => {
    await caseController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    CaseModel.create.mockReturnValue(newCase);
    await caseController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newCase);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    CaseModel.create.mockReturnValue(rejectedPromise);
    await caseController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Case
 */
describe('CaseController.updateEntityById', () => {
  it('should have a updateEntityById function', () => {
    expect(typeof caseController.updateEntityById).toBe('function');
  });
  it('should update with CaseModel.findByIdAndUpdate', async () => {
    req.params.id = caseId;
    req.body = newCase;
    await caseController.updateEntityById(req, res, next);

    expect(CaseModel.findByIdAndUpdate).toHaveBeenCalledWith(caseId, newCase, {
      new: true,
      useFindAndModify: false,
    });
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = caseId;
    req.body = newCase;
    CaseModel.findByIdAndUpdate.mockReturnValue(newCase);
    await caseController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCase);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    CaseModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await caseController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Case
 */
describe('CaseController.deleteEntityById', () => {
  it('should have a deleteEntityById function', () => {
    expect(typeof caseController.deleteEntityById).toBe('function');
  });
  it('should call findByIdAndDelete', async () => {
    req.params.id = caseId;
    await caseController.deleteEntityById(req, res, next);
    expect(CaseModel.findByIdAndDelete).toBeCalledWith(caseId);
  });
  it('should return 200 OK and deleted CaseModel', async () => {
    CaseModel.findByIdAndDelete.mockReturnValue(newCase);
    await caseController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCase);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error deleting' };
    const rejectedPromise = Promise.reject(errorMessage);
    CaseModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await caseController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should handle 404', async () => {
    CaseModel.findByIdAndDelete.mockReturnValue(null);
    await caseController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
