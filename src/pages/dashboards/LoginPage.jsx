import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../auth/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(user, token);
      // Redirect based on role
      switch (user.role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Manager':
          navigate('/manager');
          break;
        case 'Telecaller':
          navigate('/telecaller');
          break;
        case 'Student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6">Sign in to your account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email address</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white placeholder-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white placeholder-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>



  );
};

export default LoginPage;
