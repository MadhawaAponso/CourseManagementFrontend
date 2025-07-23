// src/pages/Register.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/authService';
import type {
  UserRequestDTO,
  LoginRequest,
} from '../types/Users';
import './style/Register.css';
import AlertMessage from './AlertMessage';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRequestDTO>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'student',
  });

  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.password.trim()) newErrors.password = 'Password is required.';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.role) newErrors.role = 'Role is required.';
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // 1) Register on the backend
      await registerUser(formData);

      // 2) Auto-login with the same creds
      const loginReq: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };
      await loginUser(loginReq);
      // loginUser already stores tokens in localStorage

      // 3) Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration/Login error:', err?.response?.data);

      // parse error for user
      let userMessage = 'Registration or login failed.';
      const raw = err?.response?.data;

      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.errorMessage === 'error-invalid-length') {
            userMessage = `Username must be between ${parsed.params[1]} and ${parsed.params[2]} characters.`;
          } else if (parsed?.message) {
            userMessage = parsed.message;
          } else {
            userMessage = raw;
          }
        } catch {
          if (raw.includes('users_email_key')) userMessage = 'Email already exists.';
          else if (raw.includes('users_username_key')) userMessage = 'Username already exists.';
          else userMessage = raw;
        }
      } else if (typeof raw === 'object' && raw?.message) {
        userMessage = raw.message;
      }

      setMessage({ text: userMessage, type: 'error' });
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <AlertMessage type={message.type} message={message.text} />}

      <form onSubmit={handleSubmit} noValidate>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span className="field-error">{errors.username}</span>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="field-error">{errors.firstName}</span>}

        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span className="field-error">{errors.lastName}</span>}

        <input
          name="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">student</option>
          <option value="instructor">instructor</option>
        </select>
        {errors.role && <span className="field-error">{errors.role}</span>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
