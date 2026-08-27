const express = require('express');
const db = require('../db/postgres');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

/* =========================
   Get or Create Cart
========================= */

async function getOrCreateCartId(userId) {
  const existingCart = await db.query(
    'SELECT id FROM carts WHERE user_id = $1',
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0].id;
  }

  const newCart = await db.query(
    `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING id
    `,
    [userId]
  );

  return newCart.rows[0].id;
}

/* =========================
   Cart Payload
========================= */

async function getCartPayload(userId) {
  const cartId = await getOrCreateCartId(userId);

  const result = await db.query(
    `
    SELECT
      ci.id AS cart_item_id,
      ci.quantity,
      p.id AS product_id,
      p.name,
      p.price,
      p.image_url
    FROM cart_items ci
    JOIN products p
      ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id
    `,
    [cartId]
  );

  const items = result.rows.map(item => ({
    ...item,
    price: Number(item.price),
    quantity: Number(item.quantity)
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    total: Number(total.toFixed(2))
  };
}

/* =========================
   Get Cart
========================= */

router.get('/', async (req, res, next) => {
  try {
    const payload = await getCartPayload(req.user.id);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

/* =========================
   Add To Cart
========================= */

router.post('/add', async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body || {};

    const qty = Math.max(
      1,
      parseInt(quantity, 10) || 1
    );

    if (!product_id) {
      return res.status(400).json({
        error: 'product_id is required'
      });
    }

    const product = await db.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
        AND status = 'active'
      `,
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const cartId = await getOrCreateCartId(
      req.user.id
    );

    const existing = await db.query(
      `
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = $1
        AND product_id = $2
      `,
      [cartId, product_id]
    );

    if (existing.rows.length > 0) {
      await db.query(
        `
        UPDATE cart_items
        SET quantity = $1
        WHERE id = $2
        `,
        [
          Number(existing.rows[0].quantity) + qty,
          existing.rows[0].id
        ]
      );
    } else {
      await db.query(
        `
        INSERT INTO cart_items
        (
          cart_id,
          product_id,
          quantity
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        `,
        [
          cartId,
          product_id,
          qty
        ]
      );
    }

    res.status(201).json(
      await getCartPayload(req.user.id)
    );
  } catch (err) {
    next(err);
  }
});

/* =========================
   Update Cart Item
========================= */

router.put('/update', async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body || {};

    const qty = parseInt(quantity, 10);

    if (!product_id || Number.isNaN(qty)) {
      return res.status(400).json({
        error: 'product_id and quantity are required'
      });
    }

    const cartId = await getOrCreateCartId(
      req.user.id
    );

    if (qty <= 0) {
      await db.query(
        `
        DELETE FROM cart_items
        WHERE cart_id = $1
          AND product_id = $2
        `,
        [cartId, product_id]
      );
    } else {
      const existing = await db.query(
        `
        SELECT id
        FROM cart_items
        WHERE cart_id = $1
          AND product_id = $2
        `,
        [cartId, product_id]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          error: 'Item not in cart'
        });
      }

      await db.query(
        `
        UPDATE cart_items
        SET quantity = $1
        WHERE id = $2
        `,
        [
          qty,
          existing.rows[0].id
        ]
      );
    }

    res.json(
      await getCartPayload(req.user.id)
    );
  } catch (err) {
    next(err);
  }
});

/* =========================
   Remove Item
========================= */

router.delete(
  '/remove/:productId',
  async (req, res, next) => {
    try {
      const cartId = await getOrCreateCartId(
        req.user.id
      );

      await db.query(
        `
        DELETE FROM cart_items
        WHERE cart_id = $1
          AND product_id = $2
        `,
        [cartId, req.params.productId]
      );

      res.json(
        await getCartPayload(req.user.id)
      );
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;