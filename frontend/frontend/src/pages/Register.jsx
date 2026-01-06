import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        formData
      );

      if (res.status === 201) {
        navigate("/dashboard");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-white">

        {/* Header */}
        <h2 className="text-3xl font-bold mb-2 text-center">
          Create your account
        </h2>
        <p className="text-sm text-slate-300 text-center mb-6">
          Start managing your bills smarter 💸
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Mobile Number", name: "mobile_no", type: "text" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "password2", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm text-slate-300">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          ))}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Get Started"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-300 mt-6">
          Already have an account?{" "}
          <span
            className="text-green-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
