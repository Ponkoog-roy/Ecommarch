# Roy Backend

Express API for the Roy restaurant template. Implements auth, products,
cart, and orders per the architecture doc's schema and route design.

**Database:** SQLite (via `better-sqlite3`) so it runs with zero setup —
the schema mirrors the MySQL design from the architecture doc field-for-field.
To move to real MySQL for production: swap `db/index.js` to use `mysql2`
(or `mysql2/promise`) with the same table definitions, and point
`DATABASE_URL` at your RDS instance.

## Setup

```bash
npm install
node db/seed.js   # creates roy.sqlite3 and seeds categories/products
npm start         # listens on http://localhost:4000
```

Copy `.env.example` to `.env` and set a real `JWT_SECRET` before deploying.

## Endpoints

- `POST /api/auth/register` `{ name, email, phone?, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET  /api/auth/profile` (Bearer token)
- `GET  /api/categories`
- `GET  /api/products?category=burgers`
- `GET  /api/products/:id`
- `GET  /api/cart` (auth)
- `POST /api/cart/add` `{ product_id, quantity }` (auth)
- `PUT  /api/cart/update` `{ product_id, quantity }` (auth; quantity 0 removes)
- `DELETE /api/cart/remove/:productId` (auth)
- `POST /api/orders` `{ delivery_address? }` (auth; places order from current cart, empties cart)
- `GET  /api/orders` (auth)
- `GET  /api/orders/:id` (auth)

Auth uses a JWT (`Authorization: Bearer <token>`), 7-day expiry.
