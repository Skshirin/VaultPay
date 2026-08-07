# VaultPay 💳

A secure digital wallet backend designed to simulate real-world financial transactions while focusing on **backend engineering, database design, security, concurrency, and transaction management**.

VaultPay allows users to create wallets, manage their balance, transfer funds, and track their transaction history.

The project is being built with a strong focus on **correctness and data consistency**, especially during concurrent transactions.

---

## 🚀 Features

### Authentication & Users

* User registration and login
* Secure password hashing
* JWT-based authentication
* Protected API routes
* Role-based access control

### Wallet

* Create and manage user wallets
* View wallet balance
* Add funds
* Transfer funds between users
* Prevent negative balances

### Transactions

* Transaction history
* Transaction status tracking
* Unique transaction IDs
* Sender and receiver tracking
* Transaction timestamps
* Failed and successful transaction handling

### Database & Financial Integrity

* PostgreSQL relational database
* Database transactions
* Atomic balance updates
* Concurrency handling
* Prevention of double spending
* Database constraints and indexes
* Ledger-based transaction tracking

### Security

* Password hashing
* JWT authentication
* Request validation
* Rate limiting
* Secure error handling
* Protection against unauthorized transactions

### Advanced Features

* Redis caching
* Background jobs with BullMQ
* Transaction notifications
* API documentation with Swagger
* Automated tests
* Dockerized development environment

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Authentication & Security

* JWT
* Argon2
* Zod

### Performance & Background Processing

* Redis
* BullMQ

### Testing & Documentation

* Jest
* Supertest
* Swagger / OpenAPI

### DevOps

* Docker
* Docker Compose
* GitHub Actions

---

## 📐 High-Level Architecture

```text
                    Client
                      │
                      ▼
                Express API
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       Auth        Wallet     Transactions
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
                   Prisma
                      │
                      ▼
                PostgreSQL
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
            Redis          Background
                           Jobs / BullMQ
```

---

## 🗄️ Core Database Entities

```text
User
 │
 └── Wallet
       │
       └── Ledger Entries

Transaction
 ├── Sender
 ├── Receiver
 ├── Amount
 ├── Status
 └── Timestamp
```

The database will maintain a clear record of every financial movement to ensure transactions can be audited and balances remain consistent.

---

## 🔄 Money Transfer Flow

```text
User A
  │
  │ Transfer ₹500
  ▼
API
  │
  ├── Authenticate user
  ├── Validate request
  ├── Start database transaction
  ├── Verify available balance
  ├── Lock/update required records
  ├── Debit User A
  ├── Credit User B
  ├── Create transaction record
  ├── Create ledger entries
  └── Commit transaction
          │
          ▼
       Success
```

If any step fails, the database transaction will roll back so that money is not partially transferred.

---

## 🔐 Important Backend Concepts

VaultPay is designed to provide hands-on experience with:

* REST API design
* Relational database modeling
* SQL
* Database transactions
* ACID properties
* Concurrency control
* Race conditions
* Idempotency
* Database locking
* Indexing
* Authentication
* Authorization
* Input validation
* Error handling
* Rate limiting
* Caching
* Background processing
* Automated testing

---

## 📁 Project Structure

```text
vaultpay/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── utils/
│   └── app.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd vaultpay
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL="postgresql://username:password@localhost:5432/vaultpay"

JWT_SECRET="your-secret-key"

REDIS_URL="redis://localhost:6379"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

---

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

API tests will cover important scenarios such as:

* Successful transfers
* Insufficient balance
* Unauthorized requests
* Invalid input
* Concurrent transfers
* Duplicate requests
* Failed transactions

---

## 📚 API Documentation

API documentation will be available through Swagger/OpenAPI.

```text
/api-docs
```

---

## 🎯 Project Goals

The primary goal of VaultPay is **not to build a production banking application**, but to learn how real-world backend systems maintain:

**Security → Consistency → Reliability → Performance**

The project particularly focuses on preventing incorrect financial states during failures and concurrent requests.

---

## 🔮 Future Improvements

* Payment gateway integration
* Email/SMS notifications
* Multi-currency wallets
* Scheduled transfers
* Spending analytics
* Admin dashboard
* Fraud detection
* Account freezing
* Audit logs
* Distributed transaction handling

---

## 👩‍💻 Author

**Shirin Shaikh**

Built as a backend engineering project to strengthen skills in **Node.js, TypeScript, PostgreSQL, and system/database design**.
