// middleware/validateDrug.js
module.exports = function (req, res, next) {
  const { name, dosage, cardsPerPack, packsPerBox, perDay } = req.body || {};

  // a. Check name length > 5
  if (!name || typeof name !== 'string' || name.length <= 5) {
    return res.status(400).json({ message: "Drug name must be longer than 5 characters" });
  }

  // b. Check dosage format: "XX-morning,XX-afternoon,XX-night" (X là số)
  const dosagePattern = /^\d+-morning,\d+-afternoon,\d+-night$/;
  if (!dosage || !dosagePattern.test(dosage)) {
    return res.status(400).json({ message: "Dosage must follow format: XX-morning,XX-afternoon,XX-night (X is a number)" });
  }

  // c. Check cardsPerPack > 1000
  if (cardsPerPack === undefined || isNaN(cardsPerPack) || Number(cardsPerPack) <= 1000) {
    return res.status(400).json({ message: "Cards per pack must be greater than 1000" });
  }

  // d. Check packsPerBox > 0
  if (packsPerBox === undefined || isNaN(packsPerBox) || Number(packsPerBox) <= 0) {
    return res.status(400).json({ message: "Packs per box must be more than 0" });
  }

  // e. Check perDay > 0 and < 90
  if (perDay === undefined || isNaN(perDay) || Number(perDay) <= 0 || Number(perDay) >= 90) {
    return res.status(400).json({ message: "Per day must be between 1 and 89" });
  }

  // Nếu tất cả hợp lệ → cho qua controller
  next();
};