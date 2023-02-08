const passwordValidator = require('password-validator');

module.exports = (req, res, next) => {
const password = new passwordValidator();

password
.is().min(10)
.is().max(20)
.has().uppercase(1)
.has().digits(3)
.has().not().spaces()

if (password.validate(req.body.password)){
    next();
}
else{
    console.log("ces informations manquent au mot de passe:",(password.validate(req.body.password, {list: true})))
    return res.status(401).json({message: `le mot de passe n'est pas sécurisé ${password.validate('req.body.password', { list: true})}`});
}
}