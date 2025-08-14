const express = require('express');
const router = express.Router();
const { registrarAdmin, loginAdmin } = require('../controllers/adminController.js');

router.post('/registrar', registrarAdmin);
router.post('/login', loginAdmin);

module.exports = router;
