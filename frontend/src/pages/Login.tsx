import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { apiClient } from '../api/client';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'doctor' | 'asha' | 'user'>('doctor');

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
        await apiClient.post('auth/register', {
          name,
          email,
          password,
        });

        setSuccessMessage('Account created. You can now sign in.');
        setIsRegisterMode(false);
      } else {
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

        localStorage.setItem('token', data.access_token);
        navigate('/doctor-dashboard');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Request failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectDashboard = () => {
    if (activeTab === 'asha') navigate('/asha-dashboard');
    if (activeTab === 'user') navigate('/user-dashboard');
  };

  return (
    <div className="flex flex-col space-y-8">

      {/* Header */}
      <div className="flex flex-col items-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-50 text-teal-600">
          <Activity className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Maternal Health Portal
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['doctor', 'asha', 'user'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === tab
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab === 'doctor' && 'Doctor'}
            {tab === 'asha' && 'ASHA Worker'}
            {tab === 'user' && 'Patient / User'}
          </button>
        ))}
      </div>

      {/* Doctor Login (Original Logic) */}
      {activeTab === 'doctor' && (
        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          {isRegisterMode && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Doe"
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@email.com"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg"
          >
            {isRegisterMode ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm text-teal-600"
          >
            {isRegisterMode ? 'Back to login' : 'Create doctor account'}
          </button>
        </form>
      )}

      {/* ASHA Worker Prototype Login */}
      {activeTab === 'asha' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="ASHA Worker ID"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            onClick={redirectDashboard}
            className="w-full py-3 bg-teal-600 text-white rounded-lg"
          >
            Login
          </button>
        </div>
      )}

      {/* Patient Prototype Login */}
      {activeTab === 'user' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone or Email"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            onClick={redirectDashboard}
            className="w-full py-3 bg-teal-600 text-white rounded-lg"
          >
            Login
          </button>
        </div>
      )}

    </div>
  );
};

export default Login;