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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-white p-4">
      <div className="bg-white flex rounded-lg shadow-xl overflow-hidden w-full max-w-5xl">
        
        {/* Left: Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="h-full object-cover"
          />
        </div>

        {/* Right: Login form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-3 text-center text-blue-700">Sirius Admin Login</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Please login to access the dashboard</p>

          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 px-4 py-3 rounded mb-3"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded mb-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium"
          >
            Login
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Default: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
