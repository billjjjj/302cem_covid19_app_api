const router = require('express').Router();
const CaseModel = require('../models/case.model');
const CaseController = require('../controllers/CaseController');
const { authentication } = require('../middlewares');

const caseController = new CaseController(CaseModel);

router.get('/', (req, res, next) =>
  caseController.getAllEntities(req, res, next)
);
router.get('/:id', (req, res, next) =>
  caseController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  caseController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  caseController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  caseController.deleteEntityById(req, res, next)
);

module.exports = router;
