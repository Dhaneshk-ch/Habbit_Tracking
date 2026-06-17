import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ListChecks, CalendarDays,
  Brain, BarChart3, LogOut, Settings,
  Zap, Sun, Moon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Modal from "./Modal.jsx";
import api from "../api/axios.js";

const nav = [
  { to: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { to: "/habits",    label: "Habits",      icon: ListChecks       },
  { to: "/weekly",    label: "Weekly",      icon: CalendarDays     },
  { to: "/insights",  label: "Insights",    icon: Brain            },
  { to: "/stats",     label: "Statistics",  icon: BarChart3        },
];

export default function Sidebar() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggle }            = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [morning, setMorning]           = useState(user?.morningMotivation || false);
  const [name, setName]                 = useState(user?.name || "");
  const [saving, setSaving]             = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name, morningMotivation: morning });
      updateUser(res.data.user);
      setSettingsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 fixed inset-y-0 left-0 z-30 glass border-r"
      style={{ borderColor: "var(--divider)" }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--divider)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6c6ff3,#4e48d0)", boxShadow: "0 4px 14px rgba(108,111,243,0.38)" }}>
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FlowZen</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "text-white"
                  : "text-soft hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: "linear-gradient(135deg,#6c6ff3,#4e48d0)", boxShadow: "0 4px 14px rgba(108,111,243,0.35)" }
                : {}
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t space-y-0.5" style={{ borderColor: "var(--divider)" }}>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-soft hover:bg-[var(--surface-hover)] transition"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-soft hover:bg-[var(--surface-hover)] transition"
        >
          <Settings size={17} />
          Settings
        </button>

        {/* User row */}
        <div className="px-2 py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6c6ff3,#4e48d0)" }}>
            {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-xs text-faint truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-lg text-soft hover:bg-[var(--surface-hover)] transition"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <div className="space-y-4">
          <div>
            <label className="label">Display name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl glass cursor-pointer hover:bg-[var(--surface-hover)]">
            <input
              type="checkbox"
              checked={morning}
              onChange={(e) => setMorning(e.target.checked)}
              className="mt-1"
              style={{ accentColor: "#6c6ff3" }}
            />
            <div>
              <div className="text-sm font-medium">Morning motivation</div>
              <div className="text-xs text-faint mt-0.5">
                Show a short AI-generated message every morning on the dashboard.
              </div>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button className="btn-secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
