import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Filter, Search } from 'lucide-react';

import { PageHeader, PatientTable } from '../components';
import { type Patient, type RiskLevel, usePatients } from '../hooks/usePatients';

const riskPriority = (risk: RiskLevel | undefined): number => {
  if (risk === 'Red') return 0;
  if (risk === 'Yellow') return 1;
  if (risk === 'Green') return 2;
  return 3;
};

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: patients, isLoading, isError } = usePatients();

  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [villageFilter, setVillageFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const villages = useMemo(() => {
    if (!patients) return [];
    const set = new Set<string>();
    patients.forEach((p) => {
      if (p.village) set.add(p.village);
    });
    return Array.from(set).sort();
  }, [patients]);

  const filteredPatients: Patient[] = useMemo(() => {
    if (!patients) return [];

    return [...patients]
      .filter((p) => {
        if (riskFilter !== 'ALL') {
          if (!p.risk_level || p.risk_level !== riskFilter) {
            return false;
          }
        }

        if (villageFilter !== 'ALL' && p.village !== villageFilter) {
          return false;
        }

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          if (!p.name.toLowerCase().includes(term)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => riskPriority(a.risk_level) - riskPriority(b.risk_level));
  }, [patients, riskFilter, villageFilter, searchTerm]);

  const totalPatients = patients?.length ?? 0;
  const highRiskCount =
    patients?.filter((p) => p.risk_level === 'Red').length ?? 0;

  const handleRowClick = (id: number) => {
    navigate(`/patient-details/${id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Doctor Monitoring Dashboard"
        subtitle="Review maternal patients, prioritize by risk, and open detailed records."
        icon={<Activity className="w-5 h-5" />}
        actions={
          highRiskCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-100">
              <AlertTriangle className="w-4 h-4" />
              {highRiskCount} high risk {highRiskCount === 1 ? 'patient' : 'patients'}
            </div>
          ) : null
        }
      />

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Patients</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {isLoading ? '--' : totalPatients}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-gray-500 mb-1">High Risk Patients (Red)</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {isLoading ? '--' : highRiskCount}
          </h3>
        </div>
      </div>

      {/* Filters + table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filter patients</span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:items-center w-full md:w-auto">
            <div className="relative md:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <select
              value={riskFilter ?? 'ALL'}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value === 'ALL' ? 'ALL' : (e.target.value as RiskLevel),
                )
              }
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="ALL">All risk levels</option>
              <option value="Red">Red (High)</option>
              <option value="Yellow">Yellow (Medium)</option>
              <option value="Green">Green (Low)</option>
            </select>
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="ALL">All villages</option>
              {villages.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PatientTable
          patients={filteredPatients}
          isLoading={isLoading}
          isError={isError}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
