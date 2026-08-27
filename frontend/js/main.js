AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            // Close Bootstrap mobile navbar if open
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            // Scroll after slight delay to let navbar close
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});


var searchOv = document.getElementById('searchOv');

document.getElementById('navSearchBtn').addEventListener('click', function() {
    searchOv.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        document.getElementById('searchInput').focus();
    }, 220);
});

document.getElementById('searchClose').addEventListener('click', closeSearch);

// Close when clicking backdrop
searchOv.addEventListener('click', function(e) {
    if (e.target === searchOv) closeSearch();
});

function closeSearch() {
    searchOv.classList.remove('open');
    document.body.style.overflow = '';
}

// Category buttons inside search box
document.querySelectorAll('.sovcat').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.sovcat').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        var f = this.getAttribute('data-cat');
        closeSearch();
        setTimeout(function() {
            filterMenu(f);
            document.getElementById('menu').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    });
});

// Trending tags fill the search input
document.querySelectorAll('.sovtrend .ttag').forEach(function(t) {
    t.addEventListener('click', function() {
        document.getElementById('searchInput').value = this.textContent.trim();
        document.getElementById('searchInput').focus();
    });
});


$(document).ready(function() {
	$('.magnific_popup').magnificPopup({
	  disableOn: 700,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  fixedContentPos: false,
	  disableOn: 300
	});	
});


function filterMenu(cat) {
    // sync filter buttons
    document.querySelectorAll('.filtbtn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-f') === cat);
    });
    // sync category cards
    document.querySelectorAll('.catcard').forEach(function(c) {
        c.classList.toggle('active', c.getAttribute('data-filter') === cat);
    });
    // show/hide menu cards
    document.querySelectorAll('.mwrap').forEach(function(w) {
        var c = w.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            w.classList.remove('gone');
            w.style.opacity = '0';
            w.style.transform = 'translateY(16px)';
            setTimeout(function() {
                w.style.transition = 'opacity .38s,transform .38s';
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
            }, 60);
        } else {
            w.classList.add('gone');
        }
    });
}

// Filter buttons
document.querySelectorAll('.filtbtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterMenu(this.getAttribute('data-f'));
    });
});

// Category section cards â†’ scroll + filter
document.querySelectorAll('.catcard').forEach(function(card) {
    card.addEventListener('click', function() {
        var f = this.getAttribute('data-filter');
        window.scrollTo({
            top: document.getElementById('menu').offsetTop - 80,
            behavior: 'smooth'
        });
        setTimeout(function() {
            filterMenu(f);
        }, 480);
    });
});


var menuPop = document.getElementById('menuPop');
var mpQty = 1;
var mpProductId = null;

function openMenuPop(card) {
    mpProductId = card.getAttribute('data-id');
    var img = card.getAttribute('data-img');
    var title = card.getAttribute('data-title');
    var cat = card.getAttribute('data-cat');
    var price = card.getAttribute('data-price');
    var old = card.getAttribute('data-old');
    var rating = parseFloat(card.getAttribute('data-rating'));
    var reviews = card.getAttribute('data-reviews');
    var cal = card.getAttribute('data-cal');
    var time = card.getAttribute('data-time');
    var desc = card.getAttribute('data-desc');
    var tags = card.getAttribute('data-tags') || '';

    document.getElementById('mpImg').setAttribute('src', img);
    document.getElementById('mpCat').textContent = cat;
    document.getElementById('mpTitle').textContent = title;

    var full = Math.round(rating),
        empty = 5 - full;
    document.getElementById('mpStars').innerHTML =
        '<i class="fas fa-star"></i>'.repeat(full) + 'â˜†'.repeat(empty) +
        ' <span style="color:#bbb;font-size:.78rem;">' + rating + ' (' + reviews + ' reviews)</span>';

    document.getElementById('mpDesc').textContent = desc;

    document.getElementById('mpPrice').innerHTML =
        price + (old ? '<small style="color:#ccc;text-decoration:line-through;margin-left:8px;font-size:1rem;">' + old + '</small>' : '');

    document.getElementById('mpMeta').innerHTML =
        '<div class="mpm"><div class="mpmv">' + cal + ' kcal</div><div class="mpml">Calories</div></div>' +
        '<div class="mpm"><div class="mpmv">' + time + ' min</div><div class="mpml">Prep Time</div></div>' +
        '<div class="mpm"><div class="mpmv">' + rating + '/5</div><div class="mpml">Rating</div></div>';

    document.getElementById('mpTags').innerHTML =
        tags.split(',').filter(Boolean).map(function(t) {
            return '<span class="mptag">' + t.trim() + '</span>';
        }).join('');

    mpQty = 1;
    document.getElementById('mpQnum').textContent = 1;
    document.getElementById('mpAddCart').innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    document.getElementById('mpAddCart').style.background = '';

    menuPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Card click open popup
document.querySelectorAll('.mcard').forEach(function(card) {
    card.addEventListener('click', function() {
        openMenuPop(this);
    });
});

// + button  open popup (stop propagation to avoid double firing)
document.querySelectorAll('.madd').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMenuPop(this.closest('.mcard'));
    });
});

// Heart toggle (no popup)
document.querySelectorAll('.mhrt').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var ico = this.querySelector('i');
        ico.classList.toggle('far');
        ico.classList.toggle('fas');
        this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
    });
});

// Close popup
document.getElementById('mpClose').addEventListener('click', closeMenuPop);
menuPop.addEventListener('click', function(e) {
    if (e.target === this) closeMenuPop();
});

function closeMenuPop() {
    menuPop.classList.remove('open');
    document.body.style.overflow = '';
}

// Qty +/-
document.getElementById('mpPlus').addEventListener('click', function() {
    document.getElementById('mpQnum').textContent = ++mpQty;
});
document.getElementById('mpMinus').addEventListener('click', function() {
    if (mpQty > 1) document.getElementById('mpQnum').textContent = --mpQty;
});

// Add to cart button — wired to the backend cart API
document.getElementById('mpAddCart').addEventListener('click', function() {
    if (!Auth.isLoggedIn()) {
        closeMenuPop();
        openAuthModal('login');
        return;
    }
    var self = this;
    self.disabled = true;
    Api.addToCart(mpProductId, mpQty).then(function(cart) {
        renderCartCount(cart);
        self.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        self.style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
        setTimeout(function() {
            closeMenuPop();
            self.disabled = false;
            self.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            self.style.background = '';
        }, 1000);
    }).catch(function(err) {
        self.disabled = false;
        alert(err.message || 'Could not add item to cart');
    });
});

/* ============================================================
   AUTH + CART UI  (talks to js/api.js)
   ============================================================ */

function renderCartCount(cart) {
    var count = (cart && cart.items) ? cart.items.reduce(function(s, i) { return s + i.quantity; }, 0) : 0;
    document.getElementById('cartCount').textContent = count;
}

function refreshCartCount() {
    if (!Auth.isLoggedIn()) { renderCartCount(null); return; }
    Api.getCart().then(renderCartCount).catch(function() { renderCartCount(null); });
}

function updateAuthUI() {
    var authArea = document.getElementById('authArea');
    var user = Auth.getUser();
    if (user) {
        authArea.innerHTML = '<button id="logoutBtn" class="nav-link nav-cta" style="border:0;cursor:pointer;">' +
            '<i class="fas fa-user me-1"></i>' + user.name.split(' ')[0] + ' <i class="fas fa-sign-out-alt ms-1"></i></button>';
        document.getElementById('logoutBtn').addEventListener('click', function() {
            Auth.clearToken();
            Auth.clearUser();
            updateAuthUI();
            renderCartCount(null);
        });
    } else {
        authArea.innerHTML = '<button id="loginOpenBtn" class="nav-link nav-cta" style="border:0;cursor:pointer;"><i class="fas fa-user me-1"></i>Login</button>';
        document.getElementById('loginOpenBtn').addEventListener('click', function() { openAuthModal('login'); });
    }
}

function showAuthError(msg) {
    var el = document.getElementById('authError');
    el.textContent = msg;
    el.style.display = 'block';
}
function hideAuthError() {
    document.getElementById('authError').style.display = 'none';
}

function openAuthModal(tab) {
    document.getElementById('authModal').style.display = 'flex';
    hideAuthError();
    switchAuthTab(tab || 'login');
}
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}
function switchAuthTab(tab) {
    var isLogin = tab === 'login';
    document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
    document.getElementById('registerForm').style.display = isLogin ? 'none' : 'block';
    document.getElementById('authTabLogin').classList.toggle('active', isLogin);
    document.getElementById('authTabRegister').classList.toggle('active', !isLogin);
    hideAuthError();
}

document.getElementById('authClose').addEventListener('click', closeAuthModal);
document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});
document.getElementById('authTabLogin').addEventListener('click', function() { switchAuthTab('login'); });
document.getElementById('authTabRegister').addEventListener('click', function() { switchAuthTab('register'); });

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAuthError();
    var btn = document.getElementById('loginSubmit');
    btn.disabled = true;
    Api.login({
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    }).then(function(data) {
        Auth.setToken(data.token);
        Auth.setUser(data.user);
        updateAuthUI();
        refreshCartCount();
        closeAuthModal();
        this.reset && this.reset();
    }.bind(this)).catch(function(err) {
        showAuthError(err.message || 'Login failed');
    }).finally(function() { btn.disabled = false; });
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAuthError();
    var btn = document.getElementById('regSubmit');
    btn.disabled = true;
    Api.register({
        name: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value
    }).then(function(data) {
        Auth.setToken(data.token);
        Auth.setUser(data.user);
        updateAuthUI();
        refreshCartCount();
        closeAuthModal();
    }).catch(function(err) {
        showAuthError(err.message || 'Registration failed');
    }).finally(function() { btn.disabled = false; });
});

/* ---- Cart drawer ---- */
function renderCartDrawer(cart) {
    var list = document.getElementById('cartItemsList');
    var items = (cart && cart.items) || [];

    if (items.length === 0) {
        list.innerHTML = '<p style="color:#999;text-align:center;margin-top:30px;">Your cart is empty</p>';
    } else {
        list.innerHTML = items.map(function(item) {
            return '<div class="cart-row" data-pid="' + item.product_id + '" style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #f1f1f1;">' +
                '<img src="' + item.image_url + '" alt="" style="width:56px;height:56px;border-radius:8px;object-fit:cover;"/>' +
                '<div style="flex:1;">' +
                    '<div style="font-weight:600;font-size:.92rem;">' + item.name + '</div>' +
                    '<div style="color:#999;font-size:.8rem;">$' + item.price.toFixed(2) + '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:6px;">' +
                    '<button class="cart-qty-btn" data-action="dec" style="width:24px;height:24px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;">-</button>' +
                    '<span style="min-width:16px;text-align:center;">' + item.quantity + '</span>' +
                    '<button class="cart-qty-btn" data-action="inc" style="width:24px;height:24px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;">+</button>' +
                '</div>' +
                '<button class="cart-remove-btn" title="Remove" style="background:none;border:0;color:#c33;cursor:pointer;"><i class="fas fa-trash"></i></button>' +
            '</div>';
        }).join('');
    }

    document.getElementById('cartTotal').textContent = '$' + ((cart && cart.total) || 0).toFixed(2);
    document.getElementById('checkoutAddressWrap').style.display = items.length ? 'block' : 'none';
    document.getElementById('checkoutBtn').style.display = items.length ? 'block' : 'none';
    document.getElementById('orderSuccess').style.display = 'none';

    // wire per-row buttons
    list.querySelectorAll('.cart-row').forEach(function(row) {
        var pid = row.getAttribute('data-pid');
        var qty = parseInt(row.querySelector('span').textContent, 10);
        row.querySelectorAll('.cart-qty-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var newQty = this.getAttribute('data-action') === 'inc' ? qty + 1 : qty - 1;
                Api.updateCartItem(pid, newQty).then(function(cart) {
                    renderCartDrawer(cart);
                    renderCartCount(cart);
                });
            });
        });
        row.querySelector('.cart-remove-btn').addEventListener('click', function() {
            Api.removeCartItem(pid).then(function(cart) {
                renderCartDrawer(cart);
                renderCartCount(cart);
            });
        });
    });
}

function openCartDrawer() {
    if (!Auth.isLoggedIn()) {
        openAuthModal('login');
        return;
    }
    document.getElementById('cartDrawer').style.display = 'block';
    Api.getCart().then(function(cart) {
        renderCartDrawer(cart);
        renderCartCount(cart);
    });
}
function closeCartDrawer() {
    document.getElementById('cartDrawer').style.display = 'none';
}

document.getElementById('cartBtn').addEventListener('click', openCartDrawer);
document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);

document.getElementById('checkoutBtn').addEventListener('click', function() {
    var btn = this;
    var address = document.getElementById('checkoutAddress').value.trim();
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing order...';
    Api.placeOrder(address).then(function() {
        document.getElementById('orderSuccess').style.display = 'block';
        Api.getCart().then(function(cart) {
            renderCartDrawer(cart);
            renderCartCount(cart);
        });
    }).catch(function(err) {
        alert(err.message || 'Could not place order');
    }).finally(function() {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i>Checkout';
    });
});

// Init on load
updateAuthUI();
refreshCartCount();


document.getElementById('resBtn').addEventListener('click', function() {
    var btn = this;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    btn.disabled = true;
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
        btn.disabled = false;
        var ok = document.getElementById('resOk');
        ok.style.display = 'block';
        ok.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 1500);
});


document.getElementById('ctcBtn').addEventListener('click', function() {
    var btn = this;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        var ok = document.getElementById('ctcOk');
        ok.style.display = 'block';
        ok.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 1500);
});


var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

document.querySelectorAll('.gitem').forEach(function(item) {
    galData.push({
        img: item.getAttribute('data-gimg'),
        title: item.getAttribute('data-gtitle'),
        desc: item.getAttribute('data-gdesc')
    });
    item.addEventListener('click', function() {
        openGal(parseInt(this.getAttribute('data-gi')));
    });
});

function openGal(i) {
    galIdx = i;
    var g = galData[i];
    document.getElementById('gpImg').setAttribute('src', g.img);
    document.getElementById('gpTitle').textContent = g.title;
    document.getElementById('gpDesc').innerHTML = g.desc;
    galPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.getElementById('gpClose').addEventListener('click', closeGal);
galPop.addEventListener('click', function(e) {
    if (e.target === this) closeGal();
});

function closeGal() {
    galPop.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('gpPrev').addEventListener('click', function() {
    openGal((galIdx - 1 + galData.length) % galData.length);
});
document.getElementById('gpNext').addEventListener('click', function() {
    openGal((galIdx + 1) % galData.length);
});

/*  ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeMenuPop();
        closeGal();
        if (typeof $.magnificPopup !== 'undefined') $.magnificPopup.close();
    }
});


new Swiper('.tesSwiper', {
    slidesPerView: 1,
    spaceBetween: 22,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        640: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});


var cH = 8,
    cM = 45,
    cS = 30;
setInterval(function() {
    cS--;
    if (cS < 0) {
        cS = 59;
        cM--;
    }
    if (cM < 0) {
        cM = 59;
        cH--;
    }
    if (cH < 0) {
        cH = 8;
        cM = 45;
        cS = 30;
    }
    document.getElementById('cdH').textContent = String(cH).padStart(2, '0');
    document.getElementById('cdM').textContent = String(cM).padStart(2, '0');
    document.getElementById('cdS').textContent = String(cS).padStart(2, '0');
}, 1000);

/* â”€â”€ NEWSLETTER â”€â”€ */
document.getElementById('nlBtn').addEventListener('click', function() {
    var email = document.getElementById('nlEmail').value;
    if (email && email.includes('@')) {
        var btn = this;
        btn.textContent = 'âœ“ Subscribed!';
        btn.style.background = '#4ade80';
        btn.style.color = '#222';
        document.getElementById('nlEmail').value = '';
        setTimeout(function() {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    }
});

/*  NUMBER COUNTER ANIMATION*/
var numAnimated = false;
window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    if (!numAnimated && hero && window.scrollY > hero.offsetHeight - 300) {
        numAnimated = true;
        document.querySelectorAll('.snum').forEach(function(el) {
            var txt = el.textContent;
            var num = parseInt(txt);
            var suf = txt.replace(/[0-9]/g, '');
            if (isNaN(num)) return;
            var start = 0;
            var step = Math.ceil(num / 55);
            var iv = setInterval(function() {
                start += step;
                if (start >= num) {
                    start = num;
                    clearInterval(iv);
                }
                el.textContent = start + suf;
            }, 1400 / 55);
        });
    }
});