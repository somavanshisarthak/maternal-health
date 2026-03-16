import React from 'react';
import { StatsCards } from '../components/dashboard/StatsCards';
import { PatientTable } from '../components/dashboard/PatientTable';
import { RiskPredictionCard } from '../components/dashboard/RiskPredictionCard';
import { PregnancyCharts } from '../components/dashboard/PregnancyCharts';

const DoctorDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Panel 1 — Patient Overview */}
      <section>
        <StatsCards />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Panel 2 — Recent Patients Table */}
        <section className="xl:col-span-2 flex flex-col h-full">
          <PatientTable />
        </section>

        {/* Panel 3 — Quick Risk Prediction */}
        <section className="xl:col-span-1 flex flex-col h-full">
          <RiskPredictionCard />
        </section>
      </div>

      {/* Panel 4 — Pregnancy Monitoring Charts */}
      <section>
        <PregnancyCharts />
      </section>
    </div>
  );
};

export default DoctorDashboard;
