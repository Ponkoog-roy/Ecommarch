const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  res.json({ categories });
});

router.get('/products', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category && category !== 'all') {
    rows = db.prepare(`
      SELECT p.*, c.slug AS category_slug, c.name AS category_name
      FROM products p JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'active' AND c.slug = ?
      ORDER BY p.id
    `).all(category);
  } else {
    rows = db.prepare(`
      SELECT p.*, c.slug AS category_slug, c.name AS category_name
      FROM products p JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'active'
      ORDER BY p.id
    `).all();
  }
  res.json({ products: rows });
});

router.get('/products/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

module.exports = router;
