const Controller = require('./Controller');

class InstitutionController extends Controller {
  async getInstitutionGroup(req, res, next) {
    try {
      const regionGroup = await this.model.aggregate([
        {
          $group: {
            _id: '$region',
            data: {
              $push: {
                _id: '$_id',
                clinic: '$clinic',
                address: '$address',
                phone: '$phone',
              },
            },
          },
        },
      ]);

      res.status(200).json(regionGroup);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InstitutionController;
