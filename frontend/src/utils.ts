export function formatCurrency(amount: number | string | bigint): string {
  let val: number;
  if (typeof amount === "string" || typeof amount === "bigint") {
    try {
      const bi = BigInt(amount);
      if (bi <= BigInt(Number.MAX_SAFE_INTEGER)) {
        val = Number(bi);
      } else {
        return "₹" + bi.toLocaleString("en-IN");
      }
    } catch {
      val = parseFloat(amount as string) || 0;
    }
  } else {
    val = amount;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function safeAdd(balanceStr: string | number, amount: number): string {
  try {
    return (BigInt(balanceStr) + BigInt(Math.floor(amount))).toString();
  } catch (e) {
    return String(Number(balanceStr) + amount);
  }
}

export function safeSubtract(balanceStr: string | number, amount: number): string {
  try {
    return (BigInt(balanceStr) - BigInt(Math.floor(amount))).toString();
  } catch (e) {
    return String(Number(balanceStr) - amount);
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}
