const httpMocks = require('node-mocks-http');
const CaseModel = require('../../models/case.model');
const ReportController = require('../../controllers/ReportController');

const reportController = new ReportController();

const genderReport = require('../mock-data/report/genderReport.json');
// const confirmedReport = require('../mock-data/report/confirmedReport.json');
// const residentReport = require('../mock-data/report/residentReport.json');

jest.mock('../../models/case.model');

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

/*
 * Get Report
 */
describe('reportController.getGenderChart', () => {
  it('should have a get function', () => {
    expect(typeof reportController.getGenderChart).toBe('function');
  });
  it('should call CaseModel.countDocuments({gender: "M"})', async () => {
    await reportController.getGenderChart(req, res, next);
    expect(CaseModel.countDocuments).toHaveBeenCalledWith({ gender: 'M' });
  });
  it('should call CaseModel.countDocuments({gender: "F"}', async () => {
    await reportController.getGenderChart(req, res, next);
    expect(CaseModel.countDocuments).toHaveBeenCalledWith({ gender: 'F' });
  });
  // it('should return response with status 200 and all gender report', async () => {
  //   CaseModel.countDocuments.mockReturnValue(123);
  //   CaseModel.countDocuments.mockReturnValue(456);
  //   await reportController.getGenderChart(req, res, next);
  //   expect(res.statusCode).toBe(200);
  //   expect(res._isEndCalled()).toBeTruthy();
  //   expect(res._getJSONData()).toStrictEqual(genderReport);
  // });
  // it('should handle errors in getGenderChart', async () => {
  //   const errorMessage = { message: 'Error finding' };
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   CaseModel.countDocuments.mockReturnValue(rejectedPromise);
  //   await reportController.getGenderChart(req, res, next);
  //   expect(next).toHaveBeenCalledWith(errorMessage);
  // });
});

// describe('reportController.getResidentChart', () => {
//   it('should have a getTodos function', () => {
//     expect(typeof reportController.getResidentChart).toBe('function');
//   });
//   it('should call CaseModel.find({})', async () => {
//     await reportController.getResidentChart(req, res, next);
//     expect(CaseModel.find).toHaveBeenCalledWith({});
//   });
//   it('should return response with status 200 and all todos', async () => {
//     CaseModel.find.mockReturnValue(residentReport);
//     await reportController.getResidentChart(req, res, next);
//     expect(res.statusCode).toBe(200);
//     expect(res._isEndCalled()).toBeTruthy();
//     expect(res._getJSONData()).toStrictEqual(residentReport);
//   });
//   it('should handle errors in getResidentChart', async () => {
//     const errorMessage = { message: 'Error finding' };
//     const rejectedPromise = Promise.reject(errorMessage);
//     CaseModel.find.mockReturnValue(rejectedPromise);
//     await reportController.getResidentChart(req, res, next);
//     expect(next).toHaveBeenCalledWith(errorMessage);
//   });
// });

// describe('reportController.getConfirmedCasesChart', () => {
//   it('should have a getTodos function', () => {
//     expect(typeof reportController.getConfirmedCasesChart).toBe('function');
//   });
//   it('should call CaseModel.find({})', async () => {
//     await reportController.getConfirmedCasesChart(req, res, next);
//     expect(CaseModel.find).toHaveBeenCalledWith({});
//   });
//   it('should return response with status 200 and all todos', async () => {
//     CaseModel.find.mockReturnValue(confirmedReport);
//     await reportController.getConfirmedCasesChart(req, res, next);
//     expect(res.statusCode).toBe(200);
//     expect(res._isEndCalled()).toBeTruthy();
//     expect(res._getJSONData()).toStrictEqual(confirmedReport);
//   });
//   it('should handle errors in getConfirmedCasesChart', async () => {
//     const errorMessage = { message: 'Error finding' };
//     const rejectedPromise = Promise.reject(errorMessage);
//     CaseModel.find.mockReturnValue(rejectedPromise);
//     await reportController.getConfirmedCasesChart(req, res, next);
//     expect(next).toHaveBeenCalledWith(errorMessage);
//   });
// });
