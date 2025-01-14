const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Set up Multer for file handling
const storage = multer.memoryStorage(); // Store files in memory (good for serverless environments like Vercel)
const upload = multer({ storage: storage });

// Serve static files (e.g., CSS, images)
app.use('/public', express.static(process.cwd() + '/public'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Handle file uploads and send JSON response with metadata
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  const { originalname, mimetype, size } = req.file;
  res.json({
    name: originalname,
    type: mimetype,
    size: size
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
