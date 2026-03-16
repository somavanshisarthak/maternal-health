import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { week: '12w', weight: 62, systolicBP: 110, diastolicBP: 70, hemoglobin: 13.0 },
  { week: '16w', weight: 63.5, systolicBP: 112, diastolicBP: 72, hemoglobin: 12.8 },
  { week: '20w', weight: 65, systolicBP: 115, diastolicBP: 75, hemoglobin: 12.5 },
  { week: '24w', weight: 67, systolicBP: 118, diastolicBP: 76, hemoglobin: 12.1 },
  { week: '28w', weight: 69, systolicBP: 122, diastolicBP: 80, hemoglobin: 11.9 },
  { week: '32w', weight: 71, systolicBP: 125, diastolicBP: 82, hemoglobin: 11.8 },
  { week: '36w', weight: 73, systolicBP: 130, diastolicBP: 85, hemoglobin: 11.5 },
];

export const PregnancyCharts: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6 w-full">Patient Health Trends</h3>
      
      <div className="flex-1 min-h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="week" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} dy={10} />
            <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} dx={-10} />
            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} dx={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              itemStyle={{ fontSize: '13px', paddingTop: '4px' }}
              labelStyle={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle" />
            
            <Line yAxisId="left" type="monotone" dataKey="systolicBP" name="Systolic BP" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Line yAxisId="left" type="monotone" dataKey="diastolicBP" name="Diastolic BP" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Line yAxisId="right" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
