const router = require('express').Router();
const AreaModel = require('../models/area.model');
const HighRiskController = require('../controllers/HighRiskController');
const { authentication } = require('../middlewares');

const highRiskController = new HighRiskController(AreaModel);

router.get('/', (req, res, next) =>
  highRiskController.getAllEntities(req, res, next)
);
router.get('/:id', (req, res, next) =>
  highRiskController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  highRiskController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  highRiskController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  highRiskController.deleteEntityById(req, res, next)
);

module.exports = router;
