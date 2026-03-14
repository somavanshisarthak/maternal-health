import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowLeft, Loader2 } from 'lucide-react';

import { PageHeader } from '../components';
import { apiClient } from '../api/client';

type RiskLevel = 'Green' | 'Yellow' | 'Red' | string;

interface Patient {
  id: number;
  name: string;
  age: number;
  pregnancy_week: number;
  village: string;
}

interface Survey {
  id: number;
  patient_id: number;
  weight: string;
  blood_pressure: string;
  sugar_level: string;
  symptoms: string;
  risk_level: RiskLevel;
  created_at: string;
}

const parseNumber = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.]/g, '');
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};

const extractSystolic = (bp: string | null | undefined): number | null => {
  if (!bp) return null;
  const [sys] = bp.split('/');
  return parseNumber(sys ?? '');
};

interface LineChartProps {
  title: string;
  unit: string;
  values: { xLabel: string; value: number | null }[];
}

const SimpleLineChart: React.FC<LineChartProps> = ({ title, unit, values }) => {
  const numericValues = values.filter((v) => v.value !== null) as Array<{
    xLabel: string;
    value: number;
  }>;

  if (numericValues.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
        No {title.toLowerCase()} data yet.
      </div>
    );
  }

  const min = Math.min(...numericValues.map((v) => v.value));
  const max = Math.max(...numericValues.map((v) => v.value));
  const range = max - min || 1;

  const width = 260;
  const height = 80;
  const paddingX = 12;
  const paddingY = 8;

  const points = numericValues.map((point, index) => {
    const x =
      paddingX +
      (index / Math.max(1, numericValues.length - 1)) *
        (width - paddingX * 2);
    const normalized = (point.value - min) / range;
    const y = height - paddingY - normalized * (height - paddingY * 2);
    return `${x},${y}`;
  });

  const pathData =
    points.length > 1 ? `M ${points.join(' L ')}` : `M ${points[0]} L ${points[0]}`;

  const latest = numericValues[numericValues.length - 1]?.value ?? null;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {latest !== null && (
          <p className="text-xs text-gray-500">
            Latest: <span className="font-semibold text-gray-800">{latest}</span>{' '}
            {unit}
          </p>
        )}
      </div>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {points.length > 1 && (
          <path
            d={`${pathData} V ${height - paddingY} H ${paddingX} Z`}
            fill="url(#grad-Vitals)"
          />
        )}
        <path
          d={pathData}
          fill="none"
          stroke="#14b8a6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {numericValues.map((point, index) => {
          const [xStr, yStr] = points[index].split(',');
          const x = Number.parseFloat(xStr);
          const y = Number.parseFloat(yStr);
          return (
            <circle
              key={`${point.xLabel}-${index}`}
              cx={x}
              cy={y}
              r={3}
              fill="#0f766e"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{numericValues[0].xLabel}</span>
        {numericValues.length > 1 && (
          <span>{numericValues[numericValues.length - 1].xLabel}</span>
        )}
      </div>
    </div>
  );
};

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);

  const {
    data: patient,
    isLoading: isPatientLoading,
    isError: isPatientError,
  } = useQuery<Patient>({
    queryKey: ['patient', patientId],
    enabled: Number.isFinite(patientId),
    queryFn: async () => {
      const res = await apiClient.get<Patient>(`/patients/${patientId}`);
      return res.data;
    },
  });

  const {
    data: surveys,
    isLoading: isSurveysLoading,
    isError: isSurveysError,
  } = useQuery<Survey[]>({
    queryKey: ['patient-surveys', patientId],
    enabled: Number.isFinite(patientId),
    queryFn: async () => {
      const res = await apiClient.get<Survey[]>(`/survey/patient/${patientId}`);
      return res.data;
    },
  });

  const latestSurvey = useMemo(() => {
    if (!surveys || surveys.length === 0) return null;
    return [...surveys].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  }, [surveys]);

  const riskColor =
    latestSurvey?.risk_level === 'Red'
      ? 'bg-red-100 text-red-700'
      : latestSurvey?.risk_level === 'Yellow'
        ? 'bg-yellow-100 text-yellow-700'
        : latestSurvey?.risk_level === 'Green'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500';

  const chartValues = useMemo(() => {
    if (!surveys) return null;
    const byCreated = [...surveys].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return {
      weight: byCreated.map((s) => ({
        xLabel: new Date(s.created_at).toLocaleDateString(),
        value: parseNumber(s.weight),
      })),
      sugar: byCreated.map((s) => ({
        xLabel: new Date(s.created_at).toLocaleDateString(),
        value: parseNumber(s.sugar_level),
      })),
      systolic: byCreated.map((s) => ({
        xLabel: new Date(s.created_at).toLocaleDateString(),
        value: extractSystolic(s.blood_pressure),
      })),
    };
  }, [surveys]);

  const isLoading = isPatientLoading || isSurveysLoading;
  const isError = isPatientError || isSurveysError;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Patient file"
        subtitle="Detailed historical survey records and risk tracking."
        icon={<Activity className="w-4 h-4" />}
        actions={
          <Link
            to="/doctor-dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-xl text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        }
      />

      {isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading patient details...</span>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-sm text-red-700">
          Failed to load patient details. Please go back and try again.
        </div>
      )}

      {!isLoading && !isError && patient && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {patient.age} years • Week {patient.pregnancy_week}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${riskColor}`}>
                  {latestSurvey?.risk_level ?? 'No risk data'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs uppercase">Village</p>
                  <p className="text-gray-900 font-semibold">{patient.village}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs uppercase">Last BP</p>
                  <p className="text-gray-900 font-semibold">
                    {latestSurvey?.blood_pressure ?? '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs uppercase">Last Sugar</p>
                  <p className="text-gray-900 font-semibold">
                    {latestSurvey?.sugar_level ?? '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs uppercase">Last Check-in</p>
                  <p className="text-gray-900 font-semibold">
                    {latestSurvey
                      ? new Date(latestSurvey.created_at).toLocaleString()
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3 text-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Latest Symptoms
              </p>
              {latestSurvey?.symptoms ? (
                <ul className="flex flex-wrap gap-2">
                  {latestSurvey.symptoms.split(',').map((s) => (
                    <li
                      key={s}
                      className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium"
                    >
                      {s.trim()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No symptom notes recorded.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Vitals over time
              </h3>
              {chartValues && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SimpleLineChart
                    title="Weight"
                    unit="kg"
                    values={chartValues.weight}
                  />
                  <SimpleLineChart
                    title="Systolic BP"
                    unit="mmHg"
                    values={chartValues.systolic}
                  />
                  <SimpleLineChart
                    title="Sugar"
                    unit="mg/dL"
                    values={chartValues.sugar}
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Survey history
              </h3>
              {surveys && surveys.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {surveys
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                    )
                    .map((s) => (
                      <div
                        key={s.id}
                        className="border border-gray-100 rounded-xl p-3 text-xs space-y-1 bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">
                            {new Date(s.created_at).toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-semibold">
                            {s.risk_level}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          BP {s.blood_pressure} • Sugar {s.sugar_level}
                        </p>
                        {s.symptoms && (
                          <p className="text-gray-500">
                            Symptoms: <span>{s.symptoms}</span>
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No surveys submitted yet for this patient.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDetails;
