const express = require('express');
const router = express.Router();
const passwordCtrl = require('../middleware/password');
const userCtrl = require('../controllers/user');
// suit '/api/auth/'
router.post('/signup', passwordCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;