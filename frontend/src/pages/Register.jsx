import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Zap, Sun, Moon, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const perks = [
  "Free forever — no credit card needed",
  "AI-powered weekly habit reports",
  "90-day streak heatmap & statistics",
];

export default function Register() {
  const { user, register } = useAuth();
  const { theme, toggle }  = useTheme();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr]       = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,111,243,0.18), transparent 60%)" }} />

      <button onClick={toggle}
        className="fixed top-4 right-4 p-2.5 rounded-xl glass"
        aria-label="Toggle theme">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#6c6ff3,#4e48d0)", boxShadow: "0 4px 18px rgba(108,111,243,0.4)" }}>
            <Zap size={19} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FlowZen</span>
        </Link>

        {/* Perks row */}
        <div className="flex flex-col gap-1.5 mb-5">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-soft">
              <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />
              {p}
            </div>
          ))}
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted mt-1.5">Takes less than 30 seconds.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Your name</label>
              <input
                className="input"
                value={form.name}
                onChange={set("name")}
                placeholder="Alex Rivera"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-soft transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {err && (
              <div className="text-sm rounded-xl px-3.5 py-2.5"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create account →"}
            </button>
          </form>

          <div className="text-center mt-5 text-sm text-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "#6c6ff3" }}>
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center mt-5 text-xs text-faint">
          By creating an account you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
