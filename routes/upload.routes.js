const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload.middleware');
const { uploadProductMedia } = require('../controllers/upload.controller');

router.post('/product-media', upload.single('file'), uploadProductMedia);

//router.post('/product-media', upload.array('files', 5), uploadProductMedia);

module.exports = router;
