const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();


exports.signup = (req, res) => {
    // crypte le mot de passe 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // créé un nouvel objet User
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(401).json({ error, message: "email déjà existant dans la base de donnée" }));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire Login/mot de passe incorrecte' });
            }
            // compare deux hash pour valider le mot de passe 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ erreur, message: 'Paire login/Mot de passe incorrecte' });
                    }
                    // si c'est valide userId est configuré et un token est associé, on décode ces infos dans auth.js
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }),
                    })
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};