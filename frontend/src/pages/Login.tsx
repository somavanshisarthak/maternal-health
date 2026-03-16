import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { apiClient } from '../api/client';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Create new doctor user
        console.log('Sending register request to:', apiClient.defaults.baseURL + '/auth/register');
        await apiClient.post('auth/register', {
          name,
          email,
          password,
        });

        setSuccessMessage('Account created. You can now sign in.');
        setIsRegisterMode(false);
      } else {
        // Login existing doctor
        console.log('Sending login request to:', apiClient.defaults.baseURL + '/auth/login');
        const response = await apiClient.post(
          'auth/login',
          new URLSearchParams({
            username: email,
            password,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

        const data = response.data as {
          access_token: string;
          token_type: string;
        };

        if (!data.access_token) {
          throw new Error('No token returned from server.');
        }

        localStorage.setItem('token', data.access_token);
        navigate('/doctor-dashboard');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Request failed. Please check your inputs and try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col items-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-50 text-teal-600">
          <Activity className="w-7 h-7" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Maternal Health Portal
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to review patients and monitor high‑risk pregnancies.
          </p>
        </div>
      </div>

      {/* Login / Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
            {successMessage}
          </p>
        )}

        {isRegisterMode && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Doe"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dr.smith@clinic.com"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-xl shadow-sm hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading
            ? isRegisterMode
              ? 'Creating account…'
              : 'Signing in…'
            : isRegisterMode
              ? 'Create doctor account'
              : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setSuccessMessage(null);
            setIsRegisterMode((prev) => !prev);
          }}
          className="w-full text-sm text-teal-700 hover:text-teal-900 font-medium"
        >
          {isRegisterMode
            ? 'Back to sign in'
            : 'New doctor? Create an account'}
        </button>
      </form>

      <div className="text-center border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Patients
        </p>
        <Link
          to="/patient-survey"
          className="inline-flex items-center justify-center text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          Continue to patient survey &rarr;
        </Link>
      </div>
    </div>
  );
};

export default Login;
