const router = require('express').Router();
const ReportController = require('../controllers/ReportController');
const { authentication } = require('../middlewares');

const reportController = new ReportController();

router.get('/genderchart', authentication, (req, res, next) =>
  reportController.getGenderChart(req, res, next)
);
router.get('/residentchart', authentication, (req, res, next) =>
  reportController.getResidentChart(req, res, next)
);
router.get('/caseschart', authentication, (req, res, next) =>
  reportController.getConfirmedCasesChart(req, res, next)
);

module.exports = router;
