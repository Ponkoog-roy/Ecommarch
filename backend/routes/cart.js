const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function getOrCreateCartId(userId) {
  let cart = db.prepare('SELECT id FROM carts WHERE user_id = ?').get(userId);
  if (!cart) {
    const info = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
    return info.lastInsertRowid;
  }
  return cart.id;
}

function getCartPayload(userId) {
  const cartId = getOrCreateCartId(userId);
  const items = db.prepare(`
    SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.name, p.price, p.image_url
    FROM cart_items ci JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
    ORDER BY ci.id
  `).all(cartId);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { items, total: Math.round(total * 100) / 100 };
}

router.get('/', (req, res) => {
  res.json(getCartPayload(req.user.id));
});

router.post('/add', (req, res) => {
  const { product_id, quantity } = req.body || {};
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  if (!product_id) return res.status(400).json({ error: 'product_id is required' });

  const product = db.prepare("SELECT id FROM products WHERE id = ? AND status = 'active'").get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const cartId = getOrCreateCartId(req.user.id);
  const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?').get(cartId, product_id);
  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(existing.quantity + qty, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)').run(cartId, product_id, qty);
  }
  res.status(201).json(getCartPayload(req.user.id));
});

router.put('/update', (req, res) => {
  const { product_id, quantity } = req.body || {};
  const qty = parseInt(quantity, 10);
  if (!product_id || Number.isNaN(qty)) return res.status(400).json({ error: 'product_id and quantity are required' });

  const cartId = getOrCreateCartId(req.user.id);
  if (qty <= 0) {
    db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cartId, product_id);
  } else {
    const existing = db.prepare('SELECT id FROM cart_items WHERE cart_id = ? AND product_id = ?').get(cartId, product_id);
    if (!existing) return res.status(404).json({ error: 'Item not in cart' });
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(qty, existing.id);
  }
  res.json(getCartPayload(req.user.id));
});

router.delete('/remove/:productId', (req, res) => {
  const cartId = getOrCreateCartId(req.user.id);
  db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cartId, req.params.productId);
  res.json(getCartPayload(req.user.id));
});

module.exports = router;
