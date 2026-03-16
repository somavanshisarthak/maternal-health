import React from 'react';
import { Activity } from 'lucide-react';

const UserDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
      <div className="inline-flex items-center justify-center p-4 rounded-full bg-teal-50 text-teal-600">
        <Activity className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Dashboard</h1>
      <p className="text-gray-500">Welcome to the Patient / User portal prototype.</p>
    </div>
  );
};

export default UserDashboard;
