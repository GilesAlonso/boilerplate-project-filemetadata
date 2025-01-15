var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config();

var app = express();

// Middleware
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Set up multer for handling file uploads
var storage = multer.memoryStorage(); // Using memoryStorage to avoid saving files to disk
var upload = multer({ storage: storage }).single('upfile');

// Serve the index.html file
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html'); // Ensure 'views/index.html' exists
});

// File upload endpoint
app.post('/api/fileanalyse', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error uploading the file' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, size } = req.file;
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
  console.log(`Your app is listening on port ${port}`);
});
