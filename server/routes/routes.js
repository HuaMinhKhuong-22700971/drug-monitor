const express = require('express');
const router = express.Router();

const services = require('../services/render');             // Xử lý render UI
const controller = require('../controller/controller');     // CRUD + Purchase controller
const validateDrug = require('../middleware/validateDrug'); // Middleware validate input

// ---------- RENDER ROUTES (UI) ----------
router.get('/', services.home);
router.get('/manage', services.manage);
router.get('/dosage', services.dosage);

router.get('/add-drug', services.addDrug);
router.get('/update-drug', services.updateDrug);

// ---------- PURCHASE ROUTES ----------
router.get('/purchase', controller.getPurchase);                  // Trang purchase với mặc định
router.get('/purchase/calculate', controller.calculatePurchase);  // Hiển thị form tính toán
router.post('/purchase/calculate', controller.calculatePurchase); // Submit form tính toán (loại bỏ validateDrug)
router.post('/purchase/create', validateDrug, controller.createPurchase); // Tạo purchase

// ---------- API ROUTES (CRUD DRUG) ----------
router.post('/api/drugs', validateDrug, controller.create);        // Create drug
router.get('/api/drugs', controller.find);                         // Read all / by ID
router.put('/api/drugs/:id', validateDrug, controller.update);     // Update drug
router.delete('/api/drugs/:id', controller.delete);                // Delete drug

// ---------- API ROUTES (PURCHASE) ----------
router.post('/api/purchase', validateDrug, controller.createPurchase);

module.exports = router;