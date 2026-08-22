import { Transaction, User } from "./types";

export const mockUser: User = {
  id: "USR-48291",
  name: "Shirin",
  email: "shirin.mehta@example.com",
  walletId: "WLT-4829-7X2K",
  createdAt: "2024-01-01T00:00:00Z",
};

export const initialBalance = 25840;

export const mockTransactions: Transaction[] = [
  {
    id: "TXN-2401-001",
    type: "deposit",
    amount: 5000,
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    description: "Bank transfer",
  },
  {
    id: "TXN-2401-002",
    type: "transfer",
    amount: 1500,
    status: "completed",
    date: "2024-01-14T14:20:00Z",
    recipient: "WLT-8821-3K9P",
    description: "Payment for services",
  },
  {
    id: "TXN-2401-003",
    type: "withdrawal",
    amount: 2000,
    status: "completed",
    date: "2024-01-13T09:45:00Z",
    description: "ATM withdrawal",
  },
  {
    id: "TXN-2401-004",
    type: "transfer",
    amount: 750,
    status: "pending",
    date: "2024-01-12T16:00:00Z",
    recipient: "WLT-2210-5M7R",
    description: "Rent split",
  },
  {
    id: "TXN-2401-005",
    type: "deposit",
    amount: 10000,
    status: "completed",
    date: "2024-01-10T08:00:00Z",
    description: "Salary credit",
  },
  {
    id: "TXN-2401-006",
    type: "withdrawal",
    amount: 500,
    status: "failed",
    date: "2024-01-09T11:15:00Z",
    description: "Insufficient balance",
  },
  {
    id: "TXN-2401-007",
    type: "deposit",
    amount: 30000,
    status: "completed",
    date: "2023-12-31T12:00:00Z",
    description: "Year-end bonus",
  },
  {
    id: "TXN-2401-008",
    type: "transfer",
    amount: 4410,
    status: "completed",
    date: "2023-12-28T17:30:00Z",
    recipient: "WLT-6634-9D1A",
    description: "Invoice #INV-2023-088",
  },
];
