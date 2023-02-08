const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
 
module.exports = (req, res, next) => {
   try {
    // récupère le token du header après l'espace
       const token = req.headers.authorization.split(' ')[1];
       // verify décode le token afin de comparer la clé et le token du client, le token a été initialisé dans user.js
       const decodedToken = jwt.verify(token, process.env.TOKEN);
       // récupère l'userId associé au token validé
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(403).json({ message : "identification incorrecte" });
   }
};