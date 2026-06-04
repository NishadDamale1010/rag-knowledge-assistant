const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {uploadDocument}= require('../controllers/documentController');

router.post('/upload', upload.single('pdf'),uploadDocument);
module.exports = router;