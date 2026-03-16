import React from 'react';
import { useNavigate } from 'react-router-dom';

const mockPatients = [
  { id: 1, name: "Anita Sharma", pregnancyWeek: 28, lastVisit: "3 days ago", riskLevel: "Medium" },
  { id: 2, name: "Priya Patel", pregnancyWeek: 34, lastVisit: "1 week ago", riskLevel: "High" },
  { id: 3, name: "Sneha Reddy", pregnancyWeek: 16, lastVisit: "2 weeks ago", riskLevel: "Low" },
  { id: 4, name: "Kavita Singh", pregnancyWeek: 38, lastVisit: "Yesterday", riskLevel: "High" },
];

export const PatientTable: React.FC = () => {
  const navigate = useNavigate();

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Patients</h3>
        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">View All</button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Patient Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Pregnancy Week</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Last Visit</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Risk Level</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                <td className="px-6 py-4 text-gray-600">Week {patient.pregnancyWeek}</td>
                <td className="px-6 py-4 text-gray-600">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(patient.riskLevel)}`}>
                    {patient.riskLevel} Risk
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/patient-details/${patient.id}`)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-teal-600 hover:bg-teal-50 hover:border-teal-200 transition-colors shadow-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
