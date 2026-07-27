import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImg from '../images/logo.png';
import { adminLogin, setAuthToken } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    try {
      const res = await adminLogin(form);
      const { token, admin } = res.data;

      // Store token + admin info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('admin_username', admin.username);

      // Set token for further requests
      setAuthToken(token);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-4">
      <div className="bg-white flex rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">

        {/* Left: Image */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/10 to-transparent" />
        </div>

        {/* Right: Login form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white text-xl font-bold shadow-lg shadow-blue-600/30">
              S
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sirius Admin</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input-field"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              className="btn-primary w-full py-3 text-base"
            >
              Login
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            Default: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
