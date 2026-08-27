# Sarab — Full-Stack Food Ordering

The Sarab HTML/Bootstrap template wired up to a real backend: login/register,
persistent cart, and checkout, per the architecture doc.

```
project/
  backend/    Express API + SQLite (schema mirrors the MySQL design doc)
  frontend/   The original Sarab template, with:
                - js/api.js   new — API client (auth/cart/orders)
                - js/main.js  updated — menu "Add to Cart", login modal, cart drawer
                - index.html  updated — nav login/cart buttons, auth modal, cart drawer markup
```

## Run it

**1. Backend**
```bash
cd backend
npm install
node db/seed.js
npm start        # http://localhost:4000
```

**2. Frontend** (any static file server)
```bash
cd frontend
python3 -m http.server 8080   # http://localhost:8080
```

Open http://localhost:8080. The frontend calls the API at
`http://localhost:4000/api` by default — set `window.SARAB_API_BASE` before
`js/api.js` loads (e.g. in `index.html`) to point elsewhere.

## What's wired up

- **Register / Login** — nav "Login" button opens a modal (tabs for
  login/register). On success, a JWT is stored in `localStorage` and the nav
  swaps to show the user's name.
- **Add to Cart** — clicking a menu item's `+` opens the detail popup;
  "Add to Cart" now calls `POST /api/cart/add`. If not logged in, it opens
  the login modal first.
- **Cart drawer** — the new bag icon in the nav opens a slide-in drawer
  showing live cart contents (`GET /api/cart`), with +/- quantity and
  remove, backed by `PUT /api/cart/update` and `DELETE /api/cart/remove/:id`.
- **Checkout** — "Checkout" in the drawer calls `POST /api/orders`, which
  converts the cart into an order and empties it.

## Not yet wired (natural next steps)

- Payments (`/api/payments/*` from the architecture doc) — currently orders
  are created with `payment_status: 'pending'`.
- Admin dashboard (product/category/order management UI).
- Order history / tracking page on the frontend (the `GET /api/orders`
  endpoints exist and are ready to use).
- Swapping SQLite for MySQL/RDS for production (see `backend/README.md`).
