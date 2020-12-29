const router = require('express').Router();
const AreaModel = require('../models/area.model');
const AreaController = require('../controllers/AreaController');
const { authentication } = require('../middlewares');

const areaController = new AreaController(AreaModel);

router.get('/', (req, res, next) =>
  areaController.getAllEntities(req, res, next)
);
router.get('/:id', (req, res, next) =>
  areaController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  areaController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  areaController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  areaController.deleteEntityById(req, res, next)
);

module.exports = router;
