# Finance Data Processing and Access Control Backend

A backend system for managing financial records with **role-based access control**, **data filtering**, and **dashboard analytics APIs**.

This project demonstrates backend design, API structuring, data modeling, and aggregation logic.

A sample .env file is provided for demonstration purpose only

## Features

### User & Role Management

- Create and manage users
- Role-based access control:
  - **Admin** → Full access
  - **Analyst** → Read + insights
  - **Viewer** → Read-only

- User activation/deactivation support

### Financial Records Management

- Create, read, update, delete financial records
- Each record includes:
  - amount
  - type (income / expense)
  - category
  - date
  - notes

- Records are linked to users (1 user → many records)
- Soft delete implemented (`isDeleted` flag)

### Filtering Support

- Filter records by:
  - type
  - category
  - date range (`startDate`, `endDate`)

- Combined filters supported

### Pagination Support (Records API)

The records API supports pagination to efficiently handle large datasets.

➤ Endpoint
GET /api/records?page=2&limit=5&type=expense&category=food&startDate=2024-01-01&endDate=2024-03-01&search=lunch

##  Search Support

The records API supports text-based search.

Example:
GET /api/records?search=food

Search is applied on:
- category
- notes

Search is case-insensitive and can be combined with filters.

## Rate Limiting

API is protected using rate limiting to prevent abuse.

- To keep things simple applied a global rate limiting with a 10 min window and max of 100 attempts
- Used express-rate-limiting to apply rate limiting fast 

## Swagger Api doc

-First generate a token using /api/auth/login and then click on authorize and paste the key to test on swagger

- Swagger URL: https://zorvyn-assignment-znz8.onrender.com/api-docs

### Dashboard Summary APIs

All summary APIs compute **aggregated values**, not raw data.

- `GET /api/summary/total-income`
- `GET /api/summary/total-expense`
- `GET /api/summary/net-balance`
- `GET /api/summary/category-breakdown`
- `GET /api/summary/recent-transactions`
- `GET /api/summary/monthly-trends`

### Access Control

- JWT-based authentication
- Middleware-based authorization
- Role-based data filtering:
  - Admin → all data
  - Others → only their own data

### Validation & Error Handling

- Input validation (amount, type, date, etc.)
- Proper HTTP status codes
- Clean error responses

---


##  Test with preloaded dataset.No manual testing req

The database already contains sample financial records for testing.

---

### 📌 Available Test User

You can use the following user to test all APIs:

```json
{
  "email": "admin@test.com"
}
```

---

### 🚀 Step 1: Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@test.com"
}
```

👉 This will return a JWT token.

---

### Step 2: Add Token

Include the token in all requests:

```http
Authorization: Bearer <your_token>
```

---

### 📊 Step 3: Test APIs Directly

The database already contains **15+ financial records** for this user.

You can directly test:

#### 🔹 Get All Records

```http
GET /api/records?page=1&limit=100
```

---

#### 🔹 Filtered Records

```http
GET /api/records?type=expense&category=food
```

---

#### 🔹 Search

```http
GET /api/records?search=food
```

---

#### 🔹 Summary APIs

```http
GET /api/summary/total-income
GET /api/summary/total-expense
GET /api/summary/net-balance
GET /api/summary/category-breakdown
GET /api/summary/monthly-trends
```

---

###  Notes

* No need to manually insert records
* Data includes multiple categories, dates, and types
* Suitable for testing pagination, filtering, search, and aggregation




## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

##Project Structure

├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── db/
├──index.js <- Entry point

## Setup Instructions

### 1.Clone the repository

```bash
git clone https://github.com/Pratyushcodes0000/zorvyn-Assignment-.git
cd finance-dashboard-backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
KEY=1234567890
```

---

### 4. Seed Data

Run the following to create test users:

```bash
node seed.js
```

Available users:

admin@test.com → ADMIN  
analyst@test.com → ANALYST  
viewer@test.com → VIEWER

---

### 5. Run the server

```bash
npm run dev
```

---

## Authentication

- Login returns JWT token
- Pass token in headers:

```http
Authorization: Bearer <token>
```

---

## API Overview

### Users

- `POST /api/user` → Create user (Admin)
- `GET /api/user` → Get users
- `PATCH /api/user/:id` → Update user
- `DELETE /api/user/:id` → Deactivate user
- `POST /api/auth/login` → Token issue

---

### Records

- `POST /api/records` → Create record (Admin)
- `GET /api/records` → Get records
```
Example - GET /records?page=1&limit=5&type=expense&category=food&startDate=2024-01-01&endDate=2024-03-31&search=lunch
```
- `GET /api/records/:id` → Get single record
- `PATCH /api/records/:id` → Update record
- `DELETE /api/records/:id` → Soft delete

---

### Summary APIs

#### Total Income

```
GET /api/summary/total-income
```

#### Total Expense

```
GET /api/summary/total-expense
```

#### Net Balance

```
GET /api/summary/net-balance
```

#### Category Breakdown

```
GET /api/summary/category-breakdown
```
```
EXAMPLE - /api/summary/category-breakdown?startDate=2024-01-01&endDate=2024-03-31
```

#### Recent Transactions

```
GET /api/summary/recent-transaction
```

```
EXAMPLE - /api/summary/recent-transactions?limit=6
```

#### Monthly Trends

```
GET /api/summary/monthly-trends
```

```
Example - /api/summary/monthly-trend?startDate=2024-01-01&endDate=2024-03-31
```

## Example Response (Monthly Trends)

```json
{
    "success": true,
    "data": [
        {
            "year": 2024,
            "month": 1,
            "income": 30000,
            "expense": 5500
        },
        {
            "year": 2024,
            "month": 2,
            "income": 37000,
            "expense": 1000
        },
        {
            "year": 2024,
            "month": 3,
            "income": 35000,
            "expense": 4900
        }
    ]
}
```

---

## Design Decisions

- Used custom `recordId` instead of Mongo `_id` for business level identification
- Implemented soft delete for safe data handling
- Used aggregation pipelines for summary APIs
- Role-based filtering handled at query level (not route level)

---

## Assumptions

- Analysts are treated similar to viewers for data visibility (can be extended)
- Authentication is JWT-based (no refresh tokens)

---

## Deployment

- API Base URL: https://zorvyn-assignment-znz8.onrender.com

---


## Future Improvements
- Unit & integration tests
---

## Conclusion

This project focuses on:

- Clean backend architecture
- Role-based access control
- Efficient data aggregation
- Maintainable and scalable code structure

---

## Author

Pratyush Chowdhury
