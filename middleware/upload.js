const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname,"..",'public/uploads'), // Define your image storage folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create a Multer instance with the storage configuration
const upload = multer({ storage });


module.exports = upload;
