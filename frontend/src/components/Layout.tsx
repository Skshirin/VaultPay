import { Page } from "../types";
import { Icon } from "./Icons";

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "transactions", label: "Transactions", icon: "transactions" },
  { id: "transfer", label: "Transfer", icon: "transfer" },
  { id: "deposit", label: "Deposit", icon: "deposit" },
  { id: "withdraw", label: "Withdraw", icon: "withdraw" },
  { id: "profile", label: "Profile", icon: "profile" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const bottomNavItems = navItems.slice(0, 5);

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon name="shield" size={16} className="text-white" />
      </div>
      <span className="font-display text-xl text-slate-900">
        Vault<span className="text-indigo-600">Pay</span>
      </span>
    </div>
  );
}

interface LayoutProps {
  page: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userName: string;
  children: React.ReactNode;
}

export default function Layout({
  page,
  onNavigate,
  onLogout,
  userName,
  children,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  name={item.icon as any}
                  size={18}
                  className={active ? "text-indigo-600" : "text-slate-400"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Icon name="logout" size={18} className="text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-slate-500 capitalize">
              {navItems.find((n) => n.id === page)?.label ?? ""}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Icon name="bell" size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-indigo-700">
                {userName[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-40">
        {bottomNavItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                active ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
