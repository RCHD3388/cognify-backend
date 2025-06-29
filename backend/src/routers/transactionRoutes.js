const express = require('express');
const transactionController = require('../controllers/TransactionController');

const router = express.Router();

router.get('/:userId', transactionController.getUserTransactions);

module.exports = router;