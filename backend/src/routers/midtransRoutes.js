const express = require('express');
const midtransController = require('../controllers/MidtransController');

const router = express.Router();

router.post('/notification', midtransController.handleNotification);

module.exports = router;