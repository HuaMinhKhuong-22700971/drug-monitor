const axios = require('axios');
const PORT = process.env.PORT || 3100;
const BASE_URI = process.env.BASE_URI || 'http://localhost';

// Helper: gọi API lấy tất cả thuốc
async function fetchDrugs(params = {}) {
  const response = await axios.get(`${BASE_URI}:${PORT}/api/drugs`, { params });
  return response.data;
}

// Helper: render error page
function renderError(res, message, err = {}) {
  res.status(500).render('error', { message, error: err });
}

// ---------- RENDER ROUTES ----------

// Home page
exports.home = (req, res) => {
  res.render('index', { title: 'Home' });
};

// Add drug page
exports.addDrug = (req, res) => {
  res.render('add_drug', { title: 'Add Drug' });
};

// Update drug page
exports.updateDrug = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.redirect('/manage');

    const drug = await fetchDrugs({ id });

    if (!drug || Object.keys(drug).length === 0) {
      return res.status(404).render('error', { 
        message: `Drug with id ${id} not found`, 
        error: {} 
      });
    }

    res.render('update_drug', { 
      drug, 
      title: 'Edit Drug' 
    });
  } catch (err) {
    console.error("Error in render.updateDrug:", err.message);
    renderError(res, 'Unable to load update page', err);
  }
};

// Manage drugs page
exports.manage = async (req, res) => {
  try {
    const drugs = await fetchDrugs();
    res.render('manage', { drugs, title: 'Manage drug info' });
  } catch (err) {
    console.error("Error in render.manage:", err.message);
    renderError(res, 'Unable to load manage page', err);
  }
};

// Dosage page
exports.dosage = async (req, res) => {
  try {
    const drugs = await fetchDrugs();
    res.render('dosage', { drugs, title: 'Check Dosage' });
  } catch (err) {
    console.error("Error in render.dosage:", err.message);
    renderError(res, 'Unable to load dosage page', err);
  }
};

// Purchase page
exports.purchase = async (req, res) => {
  try {
    const drugs = await fetchDrugs();
    res.render('purchase', { drugs, title: 'Purchase Drugs' });
  } catch (err) {
    console.error("Error in render.purchase:", err.message);
    renderError(res, 'Unable to load purchase page', err);
  }
};
