import React from 'react';

import type { Patient } from '../hooks/usePatients';
import { RiskBadge } from './RiskBadge';

export interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (patientId: number) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  isLoading,
  isError,
  onRowClick,
}) => {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <div>Name</div>
        <div>Village</div>
        <div>Pregnancy Week</div>
        <div>Latest Checkup</div>
        <div className="text-right">Risk Level</div>
      </div>

      {isLoading && (
        <div className="px-4 py-6 text-sm text-gray-500">Loading patients...</div>
      )}

      {isError && !isLoading && (
        <div className="px-4 py-6 text-sm text-red-600 bg-red-50">
          Failed to load patients. Please refresh or check your connection.
        </div>
      )}

      {!isLoading && !isError && patients.length === 0 && (
        <div className="px-4 py-6 text-sm text-gray-500">
          No patients match the current filters.
        </div>
      )}

      {!isLoading &&
        !isError &&
        patients.map((patient, index) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => onRowClick(patient.id)}
            className={`grid grid-cols-5 px-4 py-3 text-sm items-center border-t border-gray-100 w-full text-left transition-colors ${
              index % 2 === 0 ? 'bg-white hover:bg-teal-50' : 'bg-gray-50 hover:bg-teal-50'
            }`}
          >
            <div className="font-semibold text-gray-900 truncate">{patient.name}</div>
            <div className="text-gray-700 truncate">{patient.village}</div>
            <div className="text-gray-700">{patient.pregnancy_week}</div>
            <div className="text-gray-500 text-xs">
              {patient.latest_checkup_date
                ? new Date(patient.latest_checkup_date).toLocaleString()
                : 'No checkups yet'}
            </div>
            <div className="text-right">
              <RiskBadge risk={patient.risk_level ?? null} />
            </div>
          </button>
        ))}
    </div>
  );
};


