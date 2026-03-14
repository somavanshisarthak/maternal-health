import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultCardProps {
  riskLevel: 'Green' | 'Yellow' | 'Red' | string;
  isOffline: boolean;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ riskLevel, isOffline, onReset }) => {
  const isRed = riskLevel === 'Red';
  const isYellow = riskLevel === 'Yellow';
  
  const bgColor = isRed ? 'bg-red-50 border-red-200' : isYellow ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
  const textColor = isRed ? 'text-red-700' : isYellow ? 'text-yellow-700' : 'text-green-700';

  return (
    <div className={`p-8 rounded-3xl border shadow-xl flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500 ${bgColor}`}>
      <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner ${
        isRed ? 'bg-red-500' : isYellow ? 'bg-yellow-500' : 'bg-green-500'
      }`}>
         <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse" />
      </div>

      <div className="space-y-2">
        <h2 className={`text-4xl font-extrabold tracking-tight ${textColor}`}>{riskLevel} Alert</h2>
        <p className="font-medium text-gray-700">
          {isRed && "Critical symptoms detected. Please seek medical advice immediately."}
          {isYellow && "Moderate risk factors flagged. A doctor will review your case shortly."}
          {!isRed && !isYellow && "Vitals appear normal. Keep up the great health monitoring!"}
        </p>
      </div>

      {isOffline && (
        <div className="bg-white/60 text-gray-800 text-sm px-4 py-2 rounded-xl font-medium shadow-sm w-full border border-gray-100">
          📍 Stored offline. Will sync automatically.
        </div>
      )}

      <div className="pt-6 w-full flex flex-col gap-3">
        <button 
          onClick={onReset}
          className="w-full py-4 bg-white text-gray-900 border font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Submit Another Survey
        </button>
        <Link 
          to="/login"
          className="w-full py-4 text-gray-600 hover:text-gray-900 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" /> Return to Login
        </Link>
      </div>
    </div>
  );
};
