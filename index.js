var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config();

var app = express();

// Middleware
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Set up storage for uploaded files using multer
var storage = multer.memoryStorage();  // Using memoryStorage as we don't need to save files to disk
var upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit the file size to 10 MB
}).single('upfile'); // Expecting 'upfile' as the file input name

// Serve index.html file
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API route to handle file upload
app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer specific error
        return res.status(400).send(`Multer error: ${err.message}`);
      } else {
        // Generic error
        return res.status(500).send(`Server error: ${err.message}`);
      }
    }

    // If file is uploaded successfully, return file metadata
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, size } = req.file;
    console.log(`File uploaded: ${originalname}, ${mimetype}, ${size} bytes`);

    res.json({
      name: originalname,
      type: mimetype,
      size: size
    });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
