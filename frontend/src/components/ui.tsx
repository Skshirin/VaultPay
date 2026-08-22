import { ReactNode, useEffect } from "react";
import { TransactionStatus } from "../types";
import { Icon } from "./Icons";

// ── Button ──────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
  outline:
    "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-400",
  ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};
const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Input({
  label,
  error,
  prefix,
  suffix,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          {...rest}
          className={`w-full border rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm py-2.5 ${
            prefix ? "pl-10" : "pl-3"
          } ${suffix ? "pr-10" : "pr-3"} ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300"
          } ${className}`}
        />
        {suffix && (
          <div className="absolute right-3 text-slate-400">{suffix}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", id, ...rest }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        {...rest}
        className={`w-full border border-slate-300 rounded-lg bg-white text-slate-900 text-sm py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
const badgeConfig: Record<
  TransactionStatus,
  { classes: string; label: string }
> = {
  completed: {
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Completed",
  },
  pending: {
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Pending",
  },
  failed: {
    classes: "bg-red-50 text-red-700 border border-red-200",
    label: "Failed",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = badgeConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
const toastConfig = {
  success: {
    icon: "check-circle",
    classes: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
  error: {
    icon: "x-circle",
    classes: "bg-red-50 border-red-200 text-red-800",
  },
  info: {
    icon: "info-circle",
    classes: "bg-indigo-50 border-indigo-200 text-indigo-800",
  },
} as const;

export function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error" | "info";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const cfg = toastConfig[type];
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${cfg.classes}`}
    >
      <Icon name={cfg.icon as any} size={18} />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onDismiss} className="ml-auto opacity-60 hover:opacity-100">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon name="transactions" size={24} className="text-slate-400" />
      </div>
      <p className="font-medium text-slate-900 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      )}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
  );
}
