const { Router } = require('express');
const userController = require('../controllers/UserController');
const router = Router();

router.post('/register', userController.register);
router.get('/user', userController.getUser);
module.exports = router;
