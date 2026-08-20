# VaultPay 💳

VaultPay is a backend banking and digital wallet system built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.

The project is designed to simulate the core backend functionality of a modern digital wallet, including user authentication, wallet management, deposits, withdrawals, money transfers, transaction history, and ledger-based transaction tracking.

The main goal of VaultPay is to build a **production-style backend architecture** with clear separation between controllers, services, repositories, validation, database access, and middleware.

---

## 🚀 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**

### Database

* **PostgreSQL**
* **Prisma ORM**

### Validation

* **Zod**

### Authentication

* JWT-based authentication
* Password hashing

### Development Tools

* Git & GitHub
* Prisma Studio
* npm

---

## 📁 Project Structure

```text
VaultPay/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── wallet.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── wallet.service.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── wallet.repository.ts
│   │   └── transaction.repository.ts
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── wallet.validator.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── wallet.routes.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏗️ Architecture

VaultPay follows a layered backend architecture:

```text
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

### Routes

Responsible for defining API endpoints and connecting them to controllers.

### Controllers

Responsible for handling HTTP requests and responses.

Controllers should remain thin and delegate business logic to services.

### Services

Contain the application's business logic.

For example:

* Checking wallet balance
* Validating transaction conditions
* Calculating updated balances
* Creating transactions
* Creating ledger entries

### Repositories

Handle database operations through Prisma.

This keeps database access separate from business logic.

### Validators

Validate incoming request data using Zod before it reaches the business logic.

### Middleware

Handles cross-cutting concerns such as authentication.

---

# 🔐 Authentication

VaultPay uses JWT-based authentication.

Authentication flow:

```text
Register
   │
   ▼
Validate Input
   │
   ▼
Hash Password
   │
   ▼
Create User
   │
   ▼
Create Wallet
```

Login flow:

```text
Login
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT
  │
  ▼
Return Token
```

Protected wallet routes require a valid JWT.

---

# 💰 Wallet System

Every user has a wallet associated with their account.

The wallet stores the user's current balance.

The wallet balance uses `BigInt` in PostgreSQL/Prisma to avoid floating-point precision problems when dealing with monetary values.

Because JavaScript's JSON serialization does not directly support `BigInt`, balances are converted to strings before being returned in API responses.

Example:

```json
{
  "balance": "1000"
}
```

---

# 💸 Transactions

VaultPay supports the following wallet operations:

### Deposit

Adds money to a user's wallet.

```text
User
 │
 ▼
Deposit Request
 │
 ▼
Validate Amount
 │
 ▼
Update Wallet Balance
 │
 ▼
Create Transaction
 │
 ▼
Create Ledger Entry
```

### Withdrawal

Removes money from a user's wallet after checking that sufficient balance is available.

```text
User
 │
 ▼
Withdraw Request
 │
 ▼
Validate Amount
 │
 ▼
Check Balance
 │
 ▼
Decrease Wallet Balance
 │
 ▼
Create Transaction
 │
 ▼
Create Ledger Entry
```

### Transfer

Transfers money between two wallets.

```text
Sender Wallet
      │
      ▼
 Check Balance
      │
      ▼
 Debit Sender
      │
      ▼
 Credit Receiver
      │
      ▼
 Create Transaction
      │
      ▼
 Create Ledger Entries
```

Transfers are performed as a database transaction so that the operation remains consistent.

---

# 📒 Ledger System

VaultPay uses a ledger-based approach for tracking money movement.

A transaction represents the overall operation, while ledger entries represent the individual financial movements.

For example, if User A transfers ₹100 to User B:

```text
Transaction
     │
     ├── DEBIT  ₹100 → User A
     │
     └── CREDIT ₹100 → User B
```

This separation makes the system easier to audit and extend.

---

# 📊 Transaction History

Users can retrieve their wallet transaction history.

The transaction history API supports pagination so that large numbers of transactions can be retrieved efficiently.

Example:

```text
GET /api/wallet/transactions?page=1&limit=10
```

Transaction history can include:

* Transaction ID
* Amount
* Status
* Transaction date
* Related wallet information
* Transaction type derived from ledger entries

---

# 🗄️ Database Models

The core database entities include:

### User

Stores user account information.

```text
User
 └── Wallet
```

### Wallet

Stores the user's current wallet balance.

```text
Wallet
 ├── User
 └── Ledger Entries
```

### Transaction

Represents a financial operation.

```text
Transaction
 ├── amount
 ├── status
 └── createdAt
```

### LedgerEntry

Represents the debit or credit side of a transaction.

```text
LedgerEntry
 ├── DEBIT
 └── CREDIT
```

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Creates a new user account and wallet.

### Login

```http
POST /api/auth/login
```

Authenticates the user and returns an authentication token.

---

## Wallet

### Get Wallet

```http
GET /api/wallet
```

Returns the authenticated user's wallet information.

### Deposit

```http
POST /api/wallet/deposit
```

Adds money to the wallet.

Example request:

```json
{
  "amount": 1000
}
```

### Withdraw

```http
POST /api/wallet/withdraw
```

Withdraws money from the wallet.

Example request:

```json
{
  "amount": 500
}
```

### Transfer

```http
POST /api/wallet/transfer
```

Transfers money to another user's wallet.

Example:

```json
{
  "receiverId": "user-id",
  "amount": 100
}
```

### Transaction History

```http
GET /api/wallet/transactions
```

Returns the authenticated user's transaction history.

Supports pagination.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"

JWT_SECRET="your_jwt_secret"

PORT=5001
```

Never commit `.env` to Git.

Make sure `.env` is included in `.gitignore`.

---

# 🛠️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd VaultPay
```

Install dependencies:

```bash
npm install
```

---

# 🗃️ Database Setup

After configuring PostgreSQL and the `DATABASE_URL`, run:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

To inspect the database visually:

```bash
npx prisma studio
```

---

# ▶️ Running the Project

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5001
```

---

# 🧪 Testing the API

The API can be tested using tools such as:

* Postman
* Insomnia
* Thunder Client

A typical flow is:

```text
1. Register User
       ↓
2. Login
       ↓
3. Receive JWT
       ↓
4. Get Wallet
       ↓
5. Deposit Money
       ↓
6. Check Balance
       ↓
7. Transfer Money
       ↓
8. Check Transaction History
```

---

# 🔒 Security Considerations

VaultPay is being designed with backend security and data integrity in mind.

Current considerations include:

* JWT authentication
* Password hashing
* Request validation with Zod
* Protected wallet routes
* Database transactions for financial operations
* PostgreSQL transactions through Prisma
* Integer-based monetary storage
* Separation of business logic and database access
* Environment variables for secrets

---

# 📌 Current Features

* [x] Node.js backend
* [x] Express.js server
* [x] TypeScript
* [x] PostgreSQL database
* [x] Prisma ORM
* [x] User authentication
* [x] JWT authentication
* [x] Password hashing
* [x] Wallet creation
* [x] Wallet balance
* [x] Deposit
* [x] Withdrawal
* [x] Wallet-to-wallet transfer
* [x] Transaction records
* [x] Ledger entries
* [x] Transaction status
* [x] Transaction history
* [x] Pagination
* [x] Request validation with Zod
* [x] Layered architecture

---

# 🚧 Future Improvements

Planned improvements include:

* [ ] Frontend dashboard
* [ ] Wallet balance UI
* [ ] Deposit/withdrawal UI
* [ ] Transfer UI
* [ ] Transaction history UI
* [ ] Improved error handling
* [ ] Rate limiting
* [ ] API documentation
* [ ] Automated tests
* [ ] Docker setup
* [ ] Production deployment
* [ ] Transaction idempotency
* [ ] Audit logging
* [ ] Role-based access control
* [ ] Email/notification system

---

# 🎯 Project Goal

VaultPay is being built as a practical backend project to demonstrate how a real-world financial application can be structured.

The project focuses particularly on:

* Clean architecture
* Separation of concerns
* Database design
* Financial transaction consistency
* Secure authentication
* REST API development
* Prisma and PostgreSQL
* Scalable backend design

The long-term goal is to evolve VaultPay from a backend wallet API into a complete banking-style application with a modern frontend and production-ready backend architecture.
