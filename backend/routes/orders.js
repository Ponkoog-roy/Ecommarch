const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/', (req, res) => {
  const { delivery_address } = req.body || {};
  const userId = req.user.id;

  const cart = db.prepare('SELECT id FROM carts WHERE user_id = ?').get(userId);
  const items = cart
    ? db.prepare(`
        SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = ?
      `).all(cart.id)
    : [];

  if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = db.transaction(() => {
    const orderInfo = db.prepare(`
      INSERT INTO orders (user_id, total_amount, payment_status, order_status, delivery_address)
      VALUES (?, ?, 'pending', 'placed', ?)
    `).run(userId, Math.round(total * 100) / 100, delivery_address || null);

    const orderId = orderInfo.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)');
    for (const i of items) insertItem.run(orderId, i.product_id, i.quantity, i.price);

    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);
    return orderId;
  });

  const orderId = placeOrder();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare(`
    SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
  `).all(orderId);
  res.status(201).json({ order: { ...order, items: orderItems } });
});

router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ orders });
});

router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare(`
    SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
  `).all(order.id);
  res.json({ order: { ...order, items } });
});

module.exports = router;
