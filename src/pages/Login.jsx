import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Alanlar boş mu?
    if (!form.email || !form.password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    // Email geçerli mi?
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      setError("");
      await dispatch(login(form));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Panel Girişi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-gray-800"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
