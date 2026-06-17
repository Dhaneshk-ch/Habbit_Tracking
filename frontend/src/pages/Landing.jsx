import { Link, Navigate } from "react-router-dom";
import {
  CheckCircle2, Flame, BarChart3, Brain,
  ArrowRight, Target, Activity, Zap,
  Sun, Moon, TrendingUp, Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import OrbitingHabits from "../components/OrbitingHabits.jsx";

const features = [
  {
    icon: CheckCircle2,
    title: "Track daily habits",
    desc: "One-tap check-offs with progress rings, streaks and a 90-day heatmap.",
    color: "text-brand-500",
    bg: "bg-brand-500/10",
  },
  {
    icon: Brain,
    title: "AI weekly insights",
    desc: "Personalised reports on what worked, what struggled, and what to try next.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Flame,
    title: "Streak recovery coach",
    desc: "When streaks break, AI generates a gentle 3-day comeback plan.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Beautiful statistics",
    desc: "See patterns across days, weeks, categories — with AI chat built-in.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const stats = [
  { value: "10k+", label: "Active users" },
  { value: "96%", label: "Streak retention" },
  { value: "4.9★", label: "User rating" },
];

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* New logo: rounded square with checkmark */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30"
            style={{ background: "linear-gradient(135deg, #6c6ff3, #4e48d0)" }}>
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FlowZen</span>
        </div>
        <nav className="flex items-center gap-2">
          <button onClick={toggle} className="btn-ghost p-2.5" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-primary">Get started free</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 chip mb-5"
              style={{ background: "rgba(108,111,243,0.12)", color: "#6c6ff3" }}>
              <Zap size={12} />
              AI-powered habit coach
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08]">
              Build habits that
              <br />
              actually{" "}
              <span style={{ background: "linear-gradient(135deg,#6c6ff3,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                stick
              </span>
              .
            </h1>
            <p className="mt-5 text-soft text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              FlowZen tracks your habits, grows your streaks, and uses AI to
              turn raw data into real, personalised encouragement.
            </p>

            {/* Stats row */}
            <div className="mt-7 flex items-center justify-center lg:justify-start gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold" style={{ color: "#6c6ff3" }}>{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                Start free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Sign in
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <OrbitingHabits />
          </div>
        </div>

        {/* ── Preview cards ── */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-6">
          {/* Today card */}
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 0% 0%, rgba(108,111,243,0.15), transparent 60%)" }} />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "#6c6ff3" }}>Today · 3 habits</div>
              <div className="space-y-2.5">
                {[
                  { icon: "💧", name: "Drink 2L water", done: true, streak: 12 },
                  { icon: "📚", name: "Read 20 minutes", done: true, streak: 7 },
                  { icon: "🏃", name: "Morning run", done: false, streak: 3 },
                ].map((h, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl glass p-3 ${h.done ? "ring-1" : ""}`}
                    style={h.done ? { "--tw-ring-color": "rgba(108,111,243,0.30)" } : {}}>
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                      style={{ background: "rgba(108,111,243,0.12)" }}>{h.icon}</span>
                    <div className="flex-1 text-sm font-medium">{h.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Flame size={11} className="text-orange-500" /> {h.streak}
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${h.done ? "text-white shadow-md" : "border-2"}`}
                      style={h.done
                        ? { background: "linear-gradient(135deg,#6c6ff3,#4e48d0)", boxShadow: "0 4px 12px rgba(108,111,243,0.4)" }
                        : { borderColor: "var(--surface-border)" }}>
                      {h.done && <CheckCircle2 size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Report card */}
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-50"
              style={{ background: "radial-gradient(circle at 100% 0%, rgba(16,185,129,0.2), transparent 55%)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#10b981" }}>
                <Zap size={12} /> AI Weekly Report
              </div>
              <p className="text-sm leading-relaxed">
                Excellent hydration week — 7/7 on <b>Drink 2L water</b>! Morning
                runs dropped to 3/5 on weekdays. You're strongest Mon–Wed — try
                prepping kit the night before to protect Thursday's momentum.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {[
                  { label: "Streaks", value: "4" },
                  { label: "This week", value: "86%" },
                  { label: "Best ever", value: "28d" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-3">
                    <div className="text-lg font-bold">{s.value}</div>
                    <div className="text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t divider">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-soft">
            Clean tracking, deep stats, and AI features that understand your actual data.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-5 hover:scale-[1.02] transition-transform">
              <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={18} />
              </div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-soft leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: "Private by design", desc: "Your habit data is yours. We never sell it or use it for ads." },
            { icon: TrendingUp, title: "Real AI insights", desc: "Powered by Gemini — not generic tips. Personalised to your data." },
            { icon: Zap, title: "Instant setup", desc: "Create account, add a habit, check it off. That's the whole onboarding." },
          ].map((t) => (
            <div key={t.title} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(108,111,243,0.12)", color: "#6c6ff3" }}>
                <t.icon size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm">{t.title}</div>
                <div className="text-xs text-soft mt-1 leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="relative p-10 text-center rounded-2xl overflow-hidden text-white shadow-2xl"
          style={{ background: "linear-gradient(135deg, #6c6ff3 0%, #4e48d0 50%, #3730a3 100%)", boxShadow: "0 20px 60px rgba(108,111,243,0.4)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{ background: "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.35), transparent 50%)" }} />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target size={18} /> <Activity size={18} /> <Zap size={18} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your first streak is 3 clicks away.
            </h2>
            <p className="mt-3 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.80)" }}>
              Create your account, add a habit, check it off. That's the whole onboarding.
            </p>
            <Link to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold hover:bg-opacity-90 transition shadow-xl"
              style={{ color: "#4e48d0" }}>
              Create my account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-faint border-t divider">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6c6ff3, #4e48d0)" }}>
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--text-soft)" }}>FlowZen</span>
        </div>
        Built with MERN · FlowZen © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
