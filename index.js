var express = require('express');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
require('dotenv').config();

var app = express();

// Middleware
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up storage for uploaded files using multer
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('upfile');

// Serve index.html file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API route to handle file upload
app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
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
  console.log('Your app is listening on port ' + port);
});
