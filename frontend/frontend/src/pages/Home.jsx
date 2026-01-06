import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full px-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 md:p-14 animate-fade-in">
          
          {/* Logo / Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Pay<span className="text-emerald-400">Bill</span>Manager
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-10">
            Never miss a payment again.  
            Track your <span className="text-white font-semibold">bills</span>, manage 
            <span className="text-white font-semibold"> due dates</span>, and stay 
            <span className="text-white font-semibold"> financially organized</span>.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <Feature title="📅 Due Date Tracking" />
            <Feature title="✅ Paid & Unpaid Status" />
            <Feature title="🔔 Smart Reminders" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="flex-1 text-center px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-[1.03]"
            >
              🚀 Get Started
            </Link>

            <Link
              to="/login"
              className="flex-1 text-center px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 transition-all duration-300 hover:scale-[1.03]"
            >
              🔐 Already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable component */
function Feature({ title }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center text-white text-sm font-medium">
      {title}
    </div>
  );
}
