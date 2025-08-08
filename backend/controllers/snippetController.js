const Snippet = require('../models/Snippet');

exports.getAllSnippets = async (req, res) => {
  const snippets = await Snippet.find().sort({ createdAt: -1 });
  res.json(snippets);
};

exports.createSnippet = async (req, res) => {
  const { title, html, css } = req.body;
  const newSnippet = new Snippet({ title, html, css });
  await newSnippet.save();
  res.status(201).json(newSnippet);
};
