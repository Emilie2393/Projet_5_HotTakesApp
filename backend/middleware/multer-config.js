const multer = require('multer');

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

// permet d'enregister des images sur l'API
const storage = multer.diskStorage({
    // formalisme multer configure le chemin et le nom du fichier
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // renomme correctemment l'image
        callback(null, name + Date.now() + '.' + extension);
    }
})

// exporte storage avec la méthode multer 
module.exports = multer({storage: storage}).single('image');