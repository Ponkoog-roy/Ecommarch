const db = require('./index');

const categories = [
  { name: 'Burgers', slug: 'burgers', image_url: 'img/menu/1.jpg' },
  { name: 'Pizza', slug: 'pizza', image_url: 'img/menu/2.jpg' },
  { name: 'Chicken', slug: 'chicken', image_url: 'img/menu/3.jpg' },
  { name: 'Wraps', slug: 'wraps', image_url: 'img/menu/4.jpg' },
  { name: 'Pasta', slug: 'pasta', image_url: 'img/menu/5.jpg' },
  { name: 'Desserts', slug: 'desserts', image_url: 'img/menu/6.jpg' },
];

const products = [
  { cat: 'burgers', name: 'Smash Burger', description: 'Juicy smash-grilled beef patty with cheddar, pickles and house sauce.', price: 14.99, old_price: 18.99, image_url: 'img/menu/1.jpg', rating: 4.8, reviews: 214, calories: 720, prep_time: 15, tags: 'Bestseller,Spicy' },
  { cat: 'pizza', name: 'Wood-Fired Pizza', description: 'Stone-baked pizza with mozzarella, basil and a rich tomato base.', price: 19.99, old_price: 24.99, image_url: 'img/menu/2.jpg', rating: 4.9, reviews: 189, calories: 890, prep_time: 20, tags: 'Bestseller' },
  { cat: 'chicken', name: 'Crispy Fried Chicken', description: 'Buttermilk-brined chicken, double-fried for a crunchy golden crust.', price: 12.99, old_price: 16.99, image_url: 'img/menu/3.jpg', rating: 4.7, reviews: 156, calories: 650, prep_time: 18, tags: 'Spicy' },
  { cat: 'wraps', name: 'Grilled Chicken Wrap', description: 'Grilled chicken, crisp veggies and garlic sauce in a soft tortilla.', price: 10.99, old_price: null, image_url: 'img/menu/4.jpg', rating: 4.6, reviews: 98, calories: 480, prep_time: 10, tags: 'Light' },
  { cat: 'desserts', name: 'Molten Lava Cake', description: 'Warm chocolate cake with a molten centre, served with vanilla ice cream.', price: 8.99, old_price: 11.99, image_url: 'img/menu/5.jpg', rating: 4.9, reviews: 231, calories: 540, prep_time: 12, tags: 'Bestseller,Sweet' },
  { cat: 'pasta', name: 'Creamy Alfredo Pasta', description: 'Fettuccine tossed in a rich parmesan cream sauce.', price: 16.99, old_price: null, image_url: 'img/menu/6.jpg', rating: 4.7, reviews: 142, calories: 810, prep_time: 16, tags: 'Comfort Food' },
];

const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name, slug, image_url) VALUES (@name, @slug, @image_url)`);
const getCategoryId = db.prepare(`SELECT id FROM categories WHERE slug = ?`);
const insertProduct = db.prepare(`
  INSERT INTO products (category_id, name, description, price, old_price, image_url, rating, reviews, calories, prep_time, tags, status)
  VALUES (@category_id, @name, @description, @price, @old_price, @image_url, @rating, @reviews, @calories, @prep_time, @tags, 'active')
`);

const seed = db.transaction(() => {
  for (const c of categories) insertCategory.run(c);
  const existing = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
  if (existing === 0) {
    for (const p of products) {
      const category_id = getCategoryId.get(p.cat).id;
      insertProduct.run({ ...p, category_id });
    }
  }
});

seed();
console.log('Seed complete: categories =', db.prepare('SELECT COUNT(*) AS n FROM categories').get().n,
  ' products =', db.prepare('SELECT COUNT(*) AS n FROM products').get().n);
