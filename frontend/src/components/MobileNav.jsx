import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ListChecks, CalendarDays,
  Brain, BarChart3, Zap, LogOut, Sun, Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Home",     icon: LayoutDashboard },
  { to: "/habits",    label: "Habits",   icon: ListChecks      },
  { to: "/weekly",    label: "Weekly",   icon: CalendarDays    },
  { to: "/insights",  label: "Insights", icon: Brain           },
  { to: "/stats",     label: "Stats",    icon: BarChart3       },
];

export default function MobileNav() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* Top mobile header */}
      <div className="md:hidden sticky top-0 z-20 glass border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "var(--divider)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6c6ff3,#4e48d0)" }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">FlowZen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-soft hover:bg-[var(--surface-hover)] transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6c6ff3,#4e48d0)" }}>
            {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-soft hover:bg-[var(--surface-hover)] transition"
            aria-label="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t flex justify-around py-1.5"
        style={{ borderColor: "var(--divider)" }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isActive ? "font-semibold" : "text-faint"
              }`
            }
            style={({ isActive }) =>
              isActive ? { color: "#6c6ff3" } : {}
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition ${isActive ? "" : ""}`}
                  style={isActive ? { background: "rgba(108,111,243,0.12)" } : {}}>
                  <Icon size={17} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
