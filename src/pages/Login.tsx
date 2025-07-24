import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../services/authService';
import type { LoginRequest } from '../types/Users';
import './style/Login.css';

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginRequest>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err?.response?.data);
      setError('❌ Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="field-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* New bit: go register */}
        <div className="register-cta">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
