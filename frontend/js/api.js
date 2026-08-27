/* ============================================================
   API CLIENT — talks to the Roy backend (see /backend)
   Set API_BASE to wherever the backend is running.
   ============================================================ */
var API_BASE = window.Roy_API_BASE || 'http://localhost:4000/api';

var Auth = {
  getToken: function() { return localStorage.getItem('roy_token'); },
  setToken: function(t) { localStorage.setItem('roy_token', t); },
  clearToken: function() { localStorage.removeItem('roy_token'); },
  getUser: function() {
    try { return JSON.parse(localStorage.getItem('roy_user') || 'null'); }
    catch (e) { return null; }
  },
  setUser: function(u) { localStorage.setItem('roy_user', JSON.stringify(u)); },
  clearUser: function() { localStorage.removeItem('roy_user'); },
  isLoggedIn: function() { return !!this.getToken(); }
};

async function apiRequest(path, options) {
  options = options || {};
  var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  var token = Auth.getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  var res = await fetch(API_BASE + path, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  var data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }

  if (!res.ok) {
    var err = new Error((data && data.error) || ('Request failed (' + res.status + ')'));
    err.status = res.status;
    throw err;
  }
  return data;
}

var Api = {
  register: function(payload) { return apiRequest('/auth/register', { method: 'POST', body: payload }); },
  login: function(payload) { return apiRequest('/auth/login', { method: 'POST', body: payload }); },
  profile: function() { return apiRequest('/auth/profile'); },

  getProducts: function(category) {
    return apiRequest('/products' + (category && category !== 'all' ? '?category=' + encodeURIComponent(category) : ''));
  },

  getCart: function() { return apiRequest('/cart'); },
  addToCart: function(productId, quantity) { return apiRequest('/cart/add', { method: 'POST', body: { product_id: productId, quantity: quantity } }); },
  updateCartItem: function(productId, quantity) { return apiRequest('/cart/update', { method: 'PUT', body: { product_id: productId, quantity: quantity } }); },
  removeCartItem: function(productId) { return apiRequest('/cart/remove/' + productId, { method: 'DELETE' }); },

  placeOrder: function(deliveryAddress) { return apiRequest('/orders', { method: 'POST', body: { delivery_address: deliveryAddress } }); }
};
