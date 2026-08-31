ROY Food Ordering Application   

A full-stack food ordering platform built with:
  
Frontend: HTML5, Bootstrap, JavaScript, Nginx
Backend: Node.js, Express.js
Database: PostgreSQL (Amazon RDS)
Containerization: Docker
Orchestration: Amazon ECS Fargate
Load Balancing: Application Load Balancer (ALB)
version 1 or 2 for EKS and 2.0 + are for AKS or k8s
Architecture
                      Internet
                          |
          +---------------------------------+
          | Frontend Application Load Balancer |
          +---------------------------------+
                          |
                          v
                +------------------+
                | Frontend ECS     |
                | Nginx Container  |
                +------------------+
                          |
                          v
          +---------------------------------+
          | Backend Application Load Balancer |
          +---------------------------------+
                          |
                          v
                +------------------+
                | Backend ECS      |
                | Express API      |
                +------------------+
                          |
                          v
                +------------------+
                | Amazon RDS       |
                | PostgreSQL       |
                +------------------+

Project Structure
project/
│
├── frontend/
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   └── main.js
│   ├── img/
│   ├── webfonts/
│   ├── index.html
│   └── Dockerfile
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
└── README.md

Features
Authentication
User Registration
User Login
JWT Authentication
Protected Routes
Product Catalog
Product Listing
Categories
Product Details
Ratings
Shopping Cart
Add to Cart
Update Quantity
Remove Items
Persistent Cart
Order Management
Place Orders
Order Items
Order History
Checkout
Database Schema
Tables
users
categories
products
carts
cart_items
orders
order_items

Local Development
Backend

Install dependencies:

cd backend

npm install


Run:

npm start


Backend:

http://localhost:4000


Health Endpoint:

http://localhost:4000/api/health

Frontend

Start static server:

cd frontend

python3 -m http.server 8080


Frontend:

http://localhost:8080

Frontend API Configuration

File:

frontend/js/api.js


Local Development:

var API_BASE =
window.Roy_API_BASE ||
'http://localhost:4000/api';


Production:

var API_BASE =
window.Roy_API_BASE ||
'http://backend-alb-xxxx.ap-southeast-2.elb.amazonaws.com/api';

Docker
Backend Image

Build:

docker build -t ponkoog/ecommarch-backend:v1 .


Push:

docker push ponkoog/ecommarch-backend:v1

Frontend Image

Build:

docker build -t ponkoog/ecommarch-frontend:v1 .


Push:

docker push ponkoog/ecommarch-frontend:v1

Amazon RDS PostgreSQL
Create Database
CREATE DATABASE roydb;

Create User
CREATE USER royuser
WITH PASSWORD 'your-password';

Grant Privileges
GRANT ALL PRIVILEGES
ON DATABASE roydb
TO royuser;

Required Database Permissions
GRANT ALL PRIVILEGES
ON ALL TABLES IN SCHEMA public
TO royuser;

GRANT ALL PRIVILEGES
ON ALL SEQUENCES IN SCHEMA public
TO royuser;

ECS Deployment
Backend Environment Variables
PORT=4000

DB_HOST=<rds-endpoint>
DB_PORT=5432

DB_NAME=roydb

DB_USER=royuser
DB_PASSWORD=<password>

JWT_SECRET=<jwt-secret>

Backend ECS Task Definition

Container:

ecommarch-backend


Port:

4000


Launch Type:

Fargate

Frontend ECS Task Definition

Container:

ecommarch-frontend


Port:

80


Launch Type:

Fargate

Backend Target Group

Create:

Target Type: IP
Protocol: HTTP
Port: 4000


Health Check:

/api/health

Backend ALB

Listener:

HTTP : 80


Forward To:

backend target group


Health Endpoint:

http://backend-alb.amazonaws.com/api/health


Expected:

{
  "success": true,
  "status": "healthy"
}

Frontend Target Group

Create:

Target Type: IP
Protocol: HTTP
Port: 80


Health Check:

/

Frontend ALB

Listener:

HTTP : 80


Forward To:

frontend target group

Deployment Workflow
New Backend Release

Build:

docker build -t ponkoog/ecommarch-backend:v2 .


Push:

docker push ponkoog/ecommarch-backend:v2


Update ECS:

Create New Task Definition Revision
Update Service
Force New Deployment

New Frontend Release

Build:

docker build -t ponkoog/ecommarch-frontend:v2 .


Push:

docker push ponkoog/ecommarch-frontend:v2


Update ECS:

Create New Task Definition Revision
Update Service
Force New Deployment

Common Problems & Fixes
localhost Issue

Wrong:

http://localhost:4000/api


Reason:

Browser interprets localhost as the user's machine.


Correct:

http://backend-alb.amazonaws.com/api

Database Permission Error

Error:

permission denied for table users


Fix:

GRANT ALL PRIVILEGES
ON ALL TABLES IN SCHEMA public
TO royuser;

Missing Table Error

Error:

relation "carts" does not exist


Cause:

Incomplete database schema.


Required Tables:

users
categories
products
carts
cart_items
orders
order_items

Backend Unreachable

Check:

ALB Listener
Target Group
Security Groups
Target Health

Production Recommendations
HTTPS

Use:

AWS Certificate Manager (ACM)


Add:

HTTPS Listener 443

Secrets Management

Store:

DB_PASSWORD
JWT_SECRET


inside:

AWS Secrets Manager


instead of ECS environment variables.

Route53

Recommended:

app.yourdomain.com
api.yourdomain.com

RDS Backup

Enable:

Automated Backups


Retention:

7 to 30 days

Monitoring

Enable:

CloudWatch Logs
CloudWatch Alarms
Container Insights

Validation Checklist
Frontend
✓ Homepage loads
✓ Products visible
✓ Register works
✓ Login works
✓ Cart works
✓ Checkout works

Backend
✓ Health endpoint works
✓ Products endpoint works
✓ Authentication works
✓ Orders work

Database
✓ Tables created
✓ Permissions correct
✓ RDS reachable
✓ Data populated

Final Deployment Status
Cluster: ecommarch
Status: Active

Frontend ECS: Running
Backend ECS: Running

Frontend ALB: Healthy
Backend ALB: Healthy

RDS PostgreSQL: Connected

Authentication: Working
Cart: Working
Orders: Working

Result

✅ Fully functional 3-tier cloud-native application deployed on AWS ECS Fargate with ALB and PostgreSQL RDS. 🚀