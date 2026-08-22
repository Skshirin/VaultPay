export type TransactionType = "deposit" | "withdrawal" | "transfer" | "received";
export type TransactionStatus = "completed" | "pending" | "failed";
export type Page =
  | "login"
  | "register"
  | "dashboard"
  | "wallet"
  | "transactions"
  | "transfer"
  | "deposit"
  | "withdraw"
  | "profile"
  | "settings";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  description?: string;
  recipient?: string;
  sender?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletId: string;
  createdAt: string;
}

export interface Toast {
  message: string;
  type: "success" | "error" | "info";
}
