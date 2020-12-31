const CaseModel = require('../models/case.model');

class ReportController {
  constructor() {
    this.model = CaseModel;
  }

  async getGenderChart(req, res, next) {
    try {
      // 呢到要 要mongodb d query 去做
      const male = await this.model.findOne({ gender: 'M' });
      const female = await this.model.findOne({ gender: 'F' });
      const maleCount = male.count;
      const femaleCount = female.count;

      if (male) {
        res.status(200).json({ lable: male, data: maleCount });
      } else {
        res.status(404).json({ message: 'Male not found' });
      }

      if (female) {
        res.status(200).json({ lable: female, data: femaleCount });
      } else {
        res.status(404).json({ message: 'Female not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  async getResidentChart(req, res, next) {
    try {
      // 呢到要 要mongodb d query 去做
      const localResident = await this.model.findOne({
        resident: 'HK resident',
      });
      const nonLocalresident = await this.model.findOne({
        resident: 'Non-HK resident',
      });
      const localResidentCount = localResident.count;
      const nonLocalresidentCount = nonLocalresident.count;

      if (localResident) {
        res
          .status(200)
          .json({ lable: localResident, data: localResidentCount });
      } else {
        res.status(404).json({ message: 'localResident not found' });
      }

      if (nonLocalresident) {
        res
          .status(200)
          .json({ lable: nonLocalresident, data: nonLocalresidentCount });
      } else {
        res.status(404).json({ message: 'nonLocalresident not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  async getConfirmedCasesChart(req, res, next) {
    try {
      // 呢到要 要mongodb d query 去做
      const confirmed = await this.model.findOne({
        confirmed: true,
      });
      const unconfirmed = await this.model.findOne({
        confirmed: false,
      });
      const confirmedCount = confirmed.count;
      const unconfirmedCount = unconfirmed.count;

      if (confirmed) {
        res.status(200).json({ lable: confirmed, data: confirmedCount });
      } else {
        res.status(404).json({ message: 'confirmed not found' });
      }

      if (unconfirmed) {
        res.status(200).json({ lable: unconfirmed, data: unconfirmedCount });
      } else {
        res.status(404).json({ message: 'unconfirmed not found' });
      }
    } catch (err) {
      next(err);
    }
  }
}
module.exports = ReportController;
