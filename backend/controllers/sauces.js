const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // créer un nouvel objet Sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  }) ;
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));

};

exports.modifySauce = (req, res) => {
  // vérifier si il y a un fichier
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  // sécuriser la modification de l'objet en évitant d'asigner l'objet à quelqu'un d'autre
  delete sauceObject._userId;
  Sauce.findById({ _id: req.params.id })
    .then((sauce) => {
      // vérification de l'utilisateur
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Utilisateur non authorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images')[1];
        // supprime l'ancienne image du dossier images
        fs.unlink(`images/${filename}`, (error) => {
          if (error) res.status(400).json({ error });
        });
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.deleteSauce = async (req, res) => {
  try {
    const sauceId = await Sauce.findById({ _id: req.params.id });
    // valide l'authentification de l'utilisateur
    if (sauceId.userId != req.auth.userId) {
      res.status(401).json({ error, message: 'Utilisateur non authorisé' });
    } else {
      const filename = sauceId.imageUrl.split('/images')[1];
      // supprime l'image du dossier images
      fs.unlink(`images/${filename}`, (error) => {
        if (error) res.status(400).json({ error });
      });
      // supprime la sauce par son _id
      const sauce = await Sauce.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ sauce, message: 'Objet supprimé !' })
    }
  }
  catch (error) {
    res.status(404).json({ error });
  }
}

exports.getAllSauces = async (req, res) => {
  try{
    // récupère les objets crées à l'aide du modèle Sauce
    const sauces = await Sauce.find({});
    res.status(200).json(sauces);
  }
  catch (error){
    res.status(404).json({ error });
  }
};

exports.getOneSauce = async (req, res) => {;
  try {
    // récupère une sauce à l'aide de son _id
    const sauce = await Sauce.findById({_id: req.params.id});
    res.status(200).json(sauce)
  }
  catch (error){
    res.status(404).json({ error });
  }
};

exports.postLikes = (req, res) => {
  Sauce.findById({
    _id: req.params.id
  })
    .then((sauce) => {
      switch (req.body.like) {
        // si le bouton like est cliqué une 1ère fois
        case 1:

          // si userId n'est pas dans le tableau userLiked
          if (!sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              // valide le produit et incrémente le like et le tableau userId  
              { _id: req.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId }
              }
            )
              .then(res.status(200).json(sauce))
              .catch((error) => res.status(401).json({ error }))
          }
          break;
        // si un des boutons est cliqué une 2ème fois
        case 0:

          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              // valide le produit et incrémente le like et le tableau userId  
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId }
              }
            )
              .then(res.status(200).json(sauce))
              .catch((error) => res.status(401).json({ error }))
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              // valide le produit et incrémente le dislike et retire l'userId du tableau 
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId }
              }
            )
              .then(res.status(200).json(sauce))
              .catch((error) => res.status(401).json({ error }))
          }
          break;
        // si le bouton dislike est cliqué
        case -1:

          if (!sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              // valide le produit et incrémente le dislike et le tableau userId  
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
              }
            )
              .then(res.status(200).json(sauce))
              .catch((error) => res.status(401).json({ error }))
          }
          break;
      }
    })
    .catch((error) => {
      res.status(404).json({ error: error })
    })
}
