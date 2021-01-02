const router = require('express').Router();
const InstitutionModel = require('../models/institution.model');
const Institution = require('../controllers/InstitutionController');
const { authentication } = require('../middlewares');

const institutionController = new Institution(InstitutionModel);

router.get('/', (req, res, next) =>
  institutionController.getAllEntities(req, res, next)
);
router.get('/group', (req, res, next) =>
  institutionController.getInstitutionGroup(req, res, next)
);
router.get('/:id', (req, res, next) =>
  institutionController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  institutionController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  institutionController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  institutionController.deleteEntityById(req, res, next)
);

module.exports = router;
