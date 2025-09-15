const Drug = require('../model/model');

// ================= CREATE =================
exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Content cannot be empty!" });
  }

  try {
    const drug = new Drug({
      name: req.body.name,
      dosage: req.body.dosage,
      cardsPerPack: req.body.cardsPerPack,
      packsPerBox: req.body.packsPerBox,
      perDay: req.body.perDay
    });

    const data = await drug.save();
    console.log(`${data.name} added to the database`);

    if (req.is('application/json')) {
      res.status(201).json(data);
    } else {
      res.redirect('/manage');
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || "There was an error while adding the drug"
    });
  }
};

// ================= READ =================
exports.find = async (req, res) => {
  try {
    if (req.query.id) {
      const id = req.query.id;
      const data = await Drug.findById(id);

      if (!data) {
        return res.status(404).json({ message: `Can't find drug with id: ${id}` });
      }
      return res.json(data);
    } else {
      const drugs = await Drug.find();
      return res.json(drugs);
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while retrieving drug information"
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Cannot update with empty data" });
  }

  const id = req.params.id;
  try {
    const updated = await Drug.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        dosage: req.body.dosage,
        cardsPerPack: req.body.cardsPerPack,
        packsPerBox: req.body.packsPerBox,
        perDay: req.body.perDay
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: `Drug with id: ${id} not found` });
    }

    console.log(`${updated.name} updated successfully`);
    return res.json({ message: "Drug updated successfully", drug: updated });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      message: "Error in updating drug information",
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Drug.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ message: `Cannot delete drug with id: ${id}. Please check id` });
    }

    console.log(`${data.name} was deleted successfully!`);
    res.json({ message: `${data.name} was deleted successfully!` });
  } catch (err) {
    res.status(500).json({
      message: "Could not delete Drug with id=" + id,
      error: err.message
    });
  }
};

// ================= PURCHASE =================
exports.getPurchase = async (req, res) => {
  try {
    const drugs = await Drug.find();
    const days = 30; // mặc định 30 ngày

    const result = drugs.map(drug => {
      const pills = days * drug.perDay;
      const cards = Math.ceil(pills / drug.cardsPerPack);
      const packs = Math.ceil(cards / drug.packsPerBox);
      return {
        id: drug._id,
        name: drug.name,
        dosage: drug.dosage,
        cardsPerPack: drug.cardsPerPack,
        packsPerBox: drug.packsPerBox,
        perDay: drug.perDay,
        cards,
        packs
      };
    });

    res.render('purchase', { title: "Purchase", drugs: result, days });
  } catch (err) {
    console.error("❌ getPurchase error:", err);
    res.status(500).render("error", { title: "Error", message: "Error loading purchase page" });
  }
};

// ================= PURCHASE CALCULATION =================
exports.calculatePurchase = async (req, res) => {
  try {
    const days = parseInt(req.body.days);
    console.log("📌 Received days:", days);
    if (!days || days <= 0 || days > 90) {
      return res.status(400).render('purchase', { 
        title: "Purchase Calculation", 
        drugs: [], 
        days: 0, 
        error: "Số ngày phải từ 1 đến 90" 
      });
    }

    const drugs = await Drug.find();
    console.log("📌 Fetched drugs:", drugs);

    const result = drugs.map(drug => {
      const pills = days * drug.perDay;
      const cards = Math.ceil(pills / drug.cardsPerPack);
      const packs = Math.ceil(cards / drug.packsPerBox);
      return {
        _id: drug._id,
        name: drug.name,
        dosage: drug.dosage,
        cardsPerPack: drug.cardsPerPack,
        packsPerBox: drug.packsPerBox,
        perDay: drug.perDay,
        cards,
        packs
      };
    });

    console.log("📌 Calculated result:", result);
    res.render('purchase', { title: "Purchase Calculation", drugs: result, days });
  } catch (err) {
    console.error("❌ calculatePurchase error:", err);
    res.status(500).render("error", { title: "Error", message: "Error calculating purchase" });
  }
};

// ================= CREATE PURCHASE =================
exports.createPurchase = async (req, res) => {
  try {
    const { drugId, days } = req.body;
    if (!drugId || !days) {
      return res.status(400).json({ message: "Missing drugId or days" });
    }

    const drug = await Drug.findById(drugId);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const totalDays = parseInt(days) + 2; // Thêm 2 ngày dự phòng
    const pills = totalDays * drug.perDay;
    const cards = Math.ceil(pills / drug.cardsPerPack);
    const totalPacks = Math.ceil(cards / drug.packsPerBox);

    // Lưu purchase vào DB (giả sử có model Purchase)
    const Purchase = require('../model/purchase'); // Thêm model purchase nếu chưa có
    const purchase = new Purchase({
      drugId: drug._id,
      days: totalDays,
      packsBought: totalPacks
    });
    const result = await purchase.save();

    console.log("Purchase created:", result);
    res.status(201).json({ message: "Purchase created", result });
  } catch (err) {
    console.error("❌ createPurchase error:", err);
    res.status(500).json({ message: err.message || "Error creating purchase" });
  }
};