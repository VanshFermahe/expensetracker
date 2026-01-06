// Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(form);

    if (res.ok) {
      navigate("/dash-board");
      return;
    }

    setError(res.error || "Invalid email or password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-slate-300 text-center mb-6 text-sm">
          Sign in to manage your bills effortlessly
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 transition text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-300 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-green-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Get started
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
