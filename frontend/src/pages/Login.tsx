import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Login: React.FC = () => {
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

      {/* Placeholder Form Layout */}
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            placeholder="dr.smith@clinic.com"
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-xl shadow-sm opacity-70 cursor-not-allowed"
        >
          Sign in (coming soon)
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
