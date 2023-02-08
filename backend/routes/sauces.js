const express = require('express');
// authentifie l'utilisateur à l'aide de token
const auth = require('../middleware/auth');
const router = express.Router();
// intègre les images au serveur 
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');
// suit '/api/sauces/'
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.postLikes);

module.exports = router;
