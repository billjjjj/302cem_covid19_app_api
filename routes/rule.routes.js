const router = require('express').Router();
const RuleModel = require('../models/rule.model');
const RuleController = require('../controllers/RuleController');
const { authentication } = require('../middlewares');

const ruleController = new RuleController(RuleModel);

router.get('/', (req, res, next) =>
  ruleController.getAllEntities(req, res, next)
);
router.get('/:id', (req, res, next) =>
  ruleController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  ruleController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  ruleController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  ruleController.deleteEntityById(req, res, next)
);

module.exports = router;
