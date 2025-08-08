const express = require('express');
const router = express.Router();
const { getAllSnippets, createSnippet } = require('../controllers/snippetController');

router.get('/', getAllSnippets);
router.post('/', createSnippet);

module.exports = router;
