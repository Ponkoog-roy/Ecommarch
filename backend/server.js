require('dotenv').config();

const express = require('express');
const cors = require('cors');

const postgres = require('./db/postgres');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;

/* ===================================================
   Middleware
=================================================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================================================
   Root Endpoint
=================================================== */

app.get('/', (req, res) => {
  res.json({
    application: 'ROY Backend API',
    database: 'PostgreSQL',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/* ===================================================
   Application Health Check
=================================================== */

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    application: 'ROY Backend API',
    database: 'PostgreSQL',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

/* ===================================================
   PostgreSQL Health Check
=================================================== */

app.get('/api/db-health', async (req, res) => {
  try {
    const result = await postgres.query('SELECT NOW()');

    res.json({
      success: true,
      database: 'PostgreSQL',
      status: 'healthy',
      serverTime: result.rows[0].now,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Database Health Error:', err);

    res.status(500).json({
      success: false,
      database: 'PostgreSQL',
      status: 'failed',
      error: err.message
    });
  }
});

/* ===================================================
   Debug Routes (Optional)
   Remove later in production
=================================================== */

app.get('/api/postgres-tables', async (req, res) => {
  try {
    const result = await postgres.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.get('/api/postgres-products', async (req, res) => {
  try {
    const result = await postgres.query(
      'SELECT * FROM products ORDER BY id'
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});





app.get('/api/debug/cart-data', async (req, res) => {
  try {
    const users = await postgres.query(
      'SELECT id, name, email FROM users ORDER BY id'
    );

    const carts = await postgres.query(
      'SELECT * FROM carts ORDER BY id'
    );

    const cartItems = await postgres.query(
      'SELECT * FROM cart_items ORDER BY id'
    );

    res.json({
      users: users.rows,
      carts: carts.rows,
      cartItems: cartItems.rows
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
/* ===================================================
   API Routes
=================================================== */

app.use('/api/auth', authRoutes);

app.use('/api', productRoutes);
// /api/products
// /api/categories

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

/* ===================================================
   404 Handler
=================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

/* ===================================================
   Global Error Handler
=================================================== */

app.use((err, req, res, next) => {
  console.error('Application Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

/* ===================================================
   Database Startup Check
=================================================== */

async function verifyDatabase() {
  try {
    await postgres.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected');
  } catch (err) {
    console.error('❌ PostgreSQL Connection Failed');
    console.error(err);
    process.exit(1);
  }
}

/* ===================================================
   Start Server
=================================================== */

async function startServer() {
  await verifyDatabase();

  const server = app.listen(PORT, () => {
    console.log('====================================');
    console.log('🚀 ROY Backend Started');
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    console.log(`🗄️ DB Health: http://localhost:${PORT}/api/db-health`);
    console.log(`🍔 Products: http://localhost:${PORT}/api/products`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('====================================');

    process.on('SIGINT', () => {
      console.log('\n🛑 SIGINT received. Shutting down...');

      server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 SIGTERM received. Shutting down...');

      server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
      });
    });
  });
}

startServer();