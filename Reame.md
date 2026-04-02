# Finance Data Processing and Access Control Backend

A backend system for managing financial records with **role-based access control**, **data filtering**, and **dashboard analytics APIs**.

This project demonstrates backend design, API structuring, data modeling, and aggregation logic.

A sample .env file is provided for demonstration purpose only



## Features

### User & Role Management

* Create and manage users
* Role-based access control:

  * **Admin** → Full access
  * **Analyst** → Read + insights
  * **Viewer** → Read-only
* User activation/deactivation support



### Financial Records Management

* Create, read, update, delete financial records
* Each record includes:

  * amount
  * type (income / expense)
  * category
  * date
  * notes
* Records are linked to users (1 user → many records)
* Soft delete implemented (`isDeleted` flag)



### Filtering Support

* Filter records by:

  * type
  * category
  * date range (`startDate`, `endDate`)
* Combined filters supported



### Dashboard Summary APIs

All summary APIs compute **aggregated values**, not raw data.

* `GET /summary/total-income`
* `GET /summary/total-expense`
* `GET /summary/net-balance`
* `GET /summary/category-breakdown`
* `GET /summary/recent-transactions`
* `GET /summary/monthly-trends`



### Access Control

* JWT-based authentication
* Middleware-based authorization
* Role-based data filtering:

  * Admin → all data
  * Others → only their own data



### Validation & Error Handling

* Input validation (amount, type, date, etc.)
* Proper HTTP status codes
* Clean error responses

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

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
git clone <your-repo-link>
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
JWT_SECRET=your_secret
```

---

### 4. Run the server

```bash
npm run dev
```

---

## Authentication

* Login returns JWT token
* Pass token in headers:

```http
Authorization: Bearer <token>
```

---

## API Overview

### Users

* `POST /users` → Create user (Admin)
* `GET /users` → Get users
* `PATCH /users/:id` → Update user
* `DELETE /users/:id` → Deactivate user
* `POST /auth/login` → Token issue

---

### Records

* `POST /records` → Create record (Admin)
* `GET /records` → Get records (filtered)
* `GET /records/:id` → Get single record
* `PATCH /records/:id` → Update record
* `DELETE /records/:id` → Soft delete

---

### Summary APIs

#### Total Income

```
GET /summary/total-income
```

#### Total Expense

```
GET /summary/total-expense
```

#### Net Balance

```
GET /summary/net-balance
```

#### Category Breakdown

```
GET /summary/category-breakdown
```

#### Recent Transactions

```
GET /summary/recent-transactions?limit=5
```

#### Monthly Trends

```
GET /summary/monthly-trends
```

## Example Response (Monthly Trends)

```json
[
  {
    "year": 2024,
    "month": 1,
    "income": 20000,
    "expense": 8000
  }
]
```

---

## Design Decisions

* Used custom `recordId` instead of Mongo `_id` for business-level identification
* Implemented soft delete for safe data handling
* Used aggregation pipelines for summary APIs
* Role-based filtering handled at query level (not route level)

---

## Assumptions

* Analysts are treated similar to viewers for data visibility (can be extended)
* No pagination added (can be implemented easily)
* Authentication is JWT-based (no refresh tokens)

---

## Deployment

* API Base URL: `<your-deployed-link>`

---

##  Postman Collection

(Optional)

* `<your-postman-link>`

---

## Future Improvements

* Pagination for records
* Search functionality
* Rate limiting
* Unit & integration tests
* Swagger API documentation

---

##  Conclusion

This project focuses on:

* Clean backend architecture
* Role-based access control
* Efficient data aggregation
* Maintainable and scalable code structure

---

## Author

Pratyush Chowdhury
