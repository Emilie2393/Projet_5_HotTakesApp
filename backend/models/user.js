const mongoose = require('mongoose');
// facilite la lecture d'erreur en cas d'utilisation multiple d'une même adresse email'
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true }
});
// applique le plugin au schéma avant son exportation
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);