// SQLite is used here so the backend runs with zero external setup.
// The schema below mirrors the MySQL design in the architecture doc 1:1,
// so swapping to MySQL later just means swapping this file's driver
// (e.g. mysql2) and adjusting AUTOINCREMENT -> AUTO_INCREMENT / ENUM syntax.

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'sarab.sqlite3');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    image_url TEXT,
    rating REAL DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    calories INTEGER,
    prep_time INTEGER,
    tags TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive'))
);

CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL REFERENCES carts(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','paid','failed')),
    order_status TEXT NOT NULL DEFAULT 'placed' CHECK(order_status IN ('placed','confirmed','preparing','dispatched','delivered','cancelled')),
    delivery_address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);
`);

module.exports = db;
