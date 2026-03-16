import React from 'react';
import { Users, AlertTriangle, Clock, Calendar } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const stats = [
    { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Risk Patients', value: '42', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Pending Followups', value: '18', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Visits This Week', value: '156', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
