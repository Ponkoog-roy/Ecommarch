const express = require('express');
const db = require('../db/postgres');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

/* =========================
   Create Order
========================= */

router.post('/', async (req, res, next) => {
  try {
    const { delivery_address } = req.body || {};
    const userId = req.user.id;

    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    const cart =
      cartResult.rows.length > 0
        ? cartResult.rows[0]
        : null;

    const itemsResult = cart
      ? await db.query(
          `
          SELECT
            ci.product_id,
            ci.quantity,
            p.price
          FROM cart_items ci
          JOIN products p
            ON p.id = ci.product_id
          WHERE ci.cart_id = $1
          `,
          [cart.id]
        )
      : { rows: [] };

    const items = itemsResult.rows;

    if (items.length === 0) {
      return res.status(400).json({
        error: 'Cart is empty'
      });
    }

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.quantity,
      0
    );

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `
        INSERT INTO orders
        (
          user_id,
          total_amount,
          payment_status,
          order_status,
          delivery_address
        )
        VALUES
        (
          $1,
          $2,
          'pending',
          'placed',
          $3
        )
        RETURNING *
        `,
        [
          userId,
          Math.round(total * 100) / 100,
          delivery_address || null
        ]
      );

      const order = orderResult.rows[0];

      for (const item of items) {
        await client.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            quantity,
            unit_price
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4
          )
          `,
          [
            order.id,
            item.product_id,
            item.quantity,
            item.price
          ]
        );
      }

      await client.query(
        `
        DELETE FROM cart_items
        WHERE cart_id = $1
        `,
        [cart.id]
      );

      await client.query('COMMIT');

      const orderItems = await db.query(
        `
        SELECT
          oi.*,
          p.name
        FROM order_items oi
        JOIN products p
          ON p.id = oi.product_id
        WHERE oi.order_id = $1
        `,
        [order.id]
      );

      res.status(201).json({
        order: {
          ...order,
          items: orderItems.rows
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

/* =========================
   List Orders
========================= */

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({
      orders: result.rows
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   Order Details
========================= */

router.get('/:id', async (req, res, next) => {
  try {
    const orderResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
        AND user_id = $2
      `,
      [
        req.params.id,
        req.user.id
      ]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      `
      SELECT
        oi.*,
        p.name
      FROM order_items oi
      JOIN products p
        ON p.id = oi.product_id
      WHERE oi.order_id = $1
      `,
      [order.id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;