const express = require('express');
const db = require('../db/postgres');

const router = express.Router();

/* =========================
   Categories
========================= */

router.get('/categories', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories ORDER BY id'
    );

    res.json({
      categories: result.rows
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   Products
========================= */

router.get('/products', async (req, res, next) => {
  try {
    const { category } = req.query;

    let result;

    if (category && category !== 'all') {
      result = await db.query(
        `
        SELECT
          p.*,
          c.slug AS category_slug,
          c.name AS category_name
        FROM products p
        JOIN categories c
          ON c.id = p.category_id
        WHERE p.status = 'active'
          AND c.slug = $1
        ORDER BY p.id
        `,
        [category]
      );
    } else {
      result = await db.query(
        `
        SELECT
          p.*,
          c.slug AS category_slug,
          c.name AS category_name
        FROM products p
        JOIN categories c
          ON c.id = p.category_id
        WHERE p.status = 'active'
        ORDER BY p.id
        `
      );
    }

    res.json({
      products: result.rows
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   Product By ID
========================= */

router.get('/products/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT
        p.*,
        c.slug AS category_slug,
        c.name AS category_name
      FROM products p
      JOIN categories c
        ON c.id = p.category_id
      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json({
      product: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
