--
-- PostgreSQL database dump
--

\restrict jl8lOdwL2aWPTM5Su2sxIPsdbGApAGfmD7CQhbsHE0a5CVUQ9lr3tiaNB9Ybdtw

-- Dumped from database version 17.11 (Debian 17.11-1.pgdg13+2)
-- Dumped by pg_dump version 17.11 (Debian 17.11-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint,
    product_id bigint,
    quantity bigint DEFAULT '1'::bigint
);


ALTER TABLE public.cart_items OWNER TO royuser;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO royuser;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.carts (
    id bigint NOT NULL,
    user_id bigint
);


ALTER TABLE public.carts OWNER TO royuser;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO royuser;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name text,
    slug text,
    image_url text
);


ALTER TABLE public.categories OWNER TO royuser;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO royuser;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    quantity bigint,
    unit_price numeric(10,2)
);


ALTER TABLE public.order_items OWNER TO royuser;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO royuser;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint,
    total_amount numeric(10,2),
    payment_status text DEFAULT 'pending'::text,
    order_status text DEFAULT 'placed'::text,
    delivery_address text,
    created_at text DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO royuser;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO royuser;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    category_id bigint,
    name text,
    description text,
    price numeric(10,2),
    old_price numeric(10,2),
    image_url text,
    rating real DEFAULT '0'::real,
    reviews bigint DEFAULT '0'::bigint,
    calories bigint,
    prep_time bigint,
    tags text,
    status text DEFAULT 'active'::text
);


ALTER TABLE public.products OWNER TO royuser;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO royuser;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: royuser
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name text,
    email text,
    phone text,
    password_hash text,
    role text DEFAULT 'customer'::text,
    created_at text DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO royuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: royuser
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO royuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: royuser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.cart_items (id, cart_id, product_id, quantity) FROM stdin;
12	1	3	1
11	1	2	4
13	1	6	1
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.carts (id, user_id) FROM stdin;
1	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.categories (id, name, slug, image_url) FROM stdin;
1	Burgers	burgers	img/menu/1.jpg
2	Pizza	pizza	img/menu/2.jpg
3	Chicken	chicken	img/menu/3.jpg
4	Wraps	wraps	img/menu/4.jpg
5	Pasta	pasta	img/menu/5.jpg
6	Desserts	desserts	img/menu/6.jpg
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price) FROM stdin;
1	1	1	1	14.99
2	1	2	2	19.99
3	1	5	2	8.99
4	2	6	4	16.99
5	3	1	4	14.99
6	4	1	4	14.99
7	4	2	5	19.99
8	4	5	2	8.99
9	5	1	41	14.99
10	5	3	4	12.99
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.orders (id, user_id, total_amount, payment_status, order_status, delivery_address, created_at) FROM stdin;
1	1	72.95	pending	placed	\N	2026-08-27 06:22:09
2	1	67.96	pending	placed	fgdgdfg	2026-08-27 06:22:35
3	1	59.96	pending	placed	\N	2026-08-27 06:51:17
4	1	177.89	pending	placed	\N	2026-08-27 10:35:19.50929+00
5	1	666.55	pending	placed	\N	2026-08-27 10:44:37.718284+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.products (id, category_id, name, description, price, old_price, image_url, rating, reviews, calories, prep_time, tags, status) FROM stdin;
1	1	Smash Burger	Juicy smash-grilled beef patty with cheddar, pickles and house sauce.	14.99	18.99	img/menu/1.jpg	4.8	214	720	15	Bestseller,Spicy	active
2	2	Wood-Fired Pizza	Stone-baked pizza with mozzarella, basil and a rich tomato base.	19.99	24.99	img/menu/2.jpg	4.9	189	890	20	Bestseller	active
3	3	Crispy Fried Chicken	Buttermilk-brined chicken, double-fried for a crunchy golden crust.	12.99	16.99	img/menu/3.jpg	4.7	156	650	18	Spicy	active
4	4	Grilled Chicken Wrap	Grilled chicken, crisp veggies and garlic sauce in a soft tortilla.	10.99	\N	img/menu/4.jpg	4.6	98	480	10	Light	active
5	6	Molten Lava Cake	Warm chocolate cake with a molten centre, served with vanilla ice cream.	8.99	11.99	img/menu/5.jpg	4.9	231	540	12	Bestseller,Sweet	active
6	5	Creamy Alfredo Pasta	Fettuccine tossed in a rich parmesan cream sauce.	16.99	\N	img/menu/6.jpg	4.7	142	810	16	Comfort Food	active
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: royuser
--

COPY public.users (id, name, email, phone, password_hash, role, created_at) FROM stdin;
1	Ponkoog Kumar Roy	roy@gmail.com	01738065760	$2a$10$T77czt.VwwRSVzlobCAyDej5l.bydOLPfmCTMbfmTeIT56CbWxsI6	customer	2026-08-27 06:16:05
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 13, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.order_items_id_seq', 10, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.orders_id_seq', 5, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: royuser
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: users idx_16390_users_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT idx_16390_users_pkey PRIMARY KEY (id);


--
-- Name: categories idx_16399_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT idx_16399_categories_pkey PRIMARY KEY (id);


--
-- Name: products idx_16406_products_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT idx_16406_products_pkey PRIMARY KEY (id);


--
-- Name: carts idx_16416_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT idx_16416_carts_pkey PRIMARY KEY (id);


--
-- Name: cart_items idx_16421_cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT idx_16421_cart_items_pkey PRIMARY KEY (id);


--
-- Name: orders idx_16427_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT idx_16427_orders_pkey PRIMARY KEY (id);


--
-- Name: order_items idx_16437_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT idx_16437_order_items_pkey PRIMARY KEY (id);


--
-- Name: idx_16390_sqlite_autoindex_users_1; Type: INDEX; Schema: public; Owner: royuser
--

CREATE UNIQUE INDEX idx_16390_sqlite_autoindex_users_1 ON public.users USING btree (email);


--
-- Name: idx_16399_sqlite_autoindex_categories_1; Type: INDEX; Schema: public; Owner: royuser
--

CREATE UNIQUE INDEX idx_16399_sqlite_autoindex_categories_1 ON public.categories USING btree (slug);


--
-- Name: idx_16416_sqlite_autoindex_carts_1; Type: INDEX; Schema: public; Owner: royuser
--

CREATE UNIQUE INDEX idx_16416_sqlite_autoindex_carts_1 ON public.carts USING btree (user_id);


--
-- Name: idx_16421_sqlite_autoindex_cart_items_1; Type: INDEX; Schema: public; Owner: royuser
--

CREATE UNIQUE INDEX idx_16421_sqlite_autoindex_cart_items_1 ON public.cart_items USING btree (cart_id, product_id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: royuser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict jl8lOdwL2aWPTM5Su2sxIPsdbGApAGfmD7CQhbsHE0a5CVUQ9lr3tiaNB9Ybdtw

