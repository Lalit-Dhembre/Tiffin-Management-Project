const express = require('express');
const { registerProvider, loginProvider, getAllProviders, getProviderById, getProviderDetails } = require('../controllers/provider');
const { isProvider } = require('../middleware/isProvider');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the more specific routes first
router.post('/register', upload.single("providerLogo"), registerProvider);
router.post('/login', loginProvider);
router.get('/me', isProvider, getProviderDetails);
router.get('/', getAllProviders);

// Dynamic route last
router.get('/:_id', getProviderById);

module.exports = router;
