const httpMocks = require('node-mocks-http');
const InstitutionModel = require('../../models/institution.model');
const InstitutionController = require('../../controllers/InstitutionController');

const institutionController = new InstitutionController(InstitutionModel);

const newInstitutions = require('../mock-data/institution/new-institutions.json');
const allInstitutions = require('../mock-data/institution/all-institutions.json');
const groupInstitutions = require('../mock-data/institution/group-institutions.json');

jest.mock('../../models/institution.model');

let req;
let res;
let next;
const institutionId = '5d5ecb5a6e598605f06cb945';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Institution
 */
describe('InstitutionController.getAllEntities', () => {
  it('should have a getTodos function', () => {
    expect(typeof institutionController.getAllEntities).toBe('function');
  });
  it('should call CaseModel.find({})', async () => {
    await institutionController.getAllEntities(req, res, next);
    expect(InstitutionModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    InstitutionModel.find.mockReturnValue(allInstitutions);
    await institutionController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allInstitutions);
  });
  it('should handle errors in getAllEntities', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.find.mockReturnValue(rejectedPromise);
    await institutionController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('InstitutionController.getEntityById', () => {
  it('should have a.getEntityById', () => {
    expect(typeof institutionController.getEntityById).toBe('function');
  });
  it('should call CaseModel.findById with route parameters', async () => {
    req.params.id = institutionId;
    await institutionController.getEntityById(req, res, next);
    expect(InstitutionModel.findById).toBeCalledWith(institutionId);
  });
  it('should return json body and response code 200', async () => {
    InstitutionModel.findById.mockReturnValue(newInstitutions);
    await institutionController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newInstitutions);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding CaseModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.findById.mockReturnValue(rejectedPromise);
    await institutionController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should return 404 when item doesnt exist', async () => {
    InstitutionModel.findById.mockReturnValue(null);
    await institutionController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Get institution group
 */
describe('InstitutionController.getinstitutionGroup', () => {
  it('should have a getTodos function', () => {
    expect(typeof institutionController.getInstitutionGroup).toBe('function');
  });

  it('should call InstitutionModel.aggregate([{...}])', async () => {
    await institutionController.getInstitutionGroup(req, res, next);
    expect(InstitutionModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: '$region',
          data: {
            $push: {
              clinic: '$clinic',
              address: '$address',
              phone: '$phone',
            },
          },
        },
      },
    ]);
  });
  it('should return response with status 200 and all todos', async () => {
    InstitutionModel.aggregate.mockReturnValue(groupInstitutions);
    await institutionController.getInstitutionGroup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(groupInstitutions);
  });

  it('should handle errors in getInstitutionGroup', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.aggregate.mockReturnValue(rejectedPromise);
    await institutionController.getInstitutionGroup(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

/*
 * Create Case
 */
describe('InstitutionController.createEntity', () => {
  beforeEach(() => {
    req.body = newInstitutions;
  });

  it('should have a.createEntity function', () => {
    expect(typeof institutionController.createEntity).toBe('function');
  });
  it('should call InstitutionModel.create', () => {
    institutionController.createEntity(req, res, next);
    expect(InstitutionModel.create).toBeCalledWith(newInstitutions);
  });
  it('should return 201 response code', async () => {
    await institutionController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    InstitutionModel.create.mockReturnValue(newInstitutions);
    await institutionController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newInstitutions);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.create.mockReturnValue(rejectedPromise);
    await institutionController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Case
 */
describe('InstitutionController.updateEntityById', () => {
  it('should have a updateEntityById function', () => {
    expect(typeof institutionController.updateEntityById).toBe('function');
  });
  it('should update with InstitutionModel.findByIdAndUpdate', async () => {
    req.params.id = institutionId;
    req.body = newInstitutions;
    await institutionController.updateEntityById(req, res, next);

    expect(InstitutionModel.findByIdAndUpdate).toHaveBeenCalledWith(
      institutionId,
      newInstitutions,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = institutionId;
    req.body = newInstitutions;
    InstitutionModel.findByIdAndUpdate.mockReturnValue(newInstitutions);
    await institutionController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newInstitutions);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await institutionController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Case
 */
describe('InstitutionController.deleteEntityById', () => {
  it('should have a deleteEntityById function', () => {
    expect(typeof institutionController.deleteEntityById).toBe('function');
  });
  it('should call findByIdAndDelete', async () => {
    req.params.id = institutionId;
    await institutionController.deleteEntityById(req, res, next);
    expect(InstitutionModel.findByIdAndDelete).toBeCalledWith(institutionId);
  });
  it('should return 200 OK and deleted CaseModel', async () => {
    InstitutionModel.findByIdAndDelete.mockReturnValue(newInstitutions);
    await institutionController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newInstitutions);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error deleting' };
    const rejectedPromise = Promise.reject(errorMessage);
    InstitutionModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await institutionController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should handle 404', async () => {
    InstitutionModel.findByIdAndDelete.mockReturnValue(null);
    await institutionController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
