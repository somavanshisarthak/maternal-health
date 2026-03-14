import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, User, HeartPulse, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import { patientSurveySchema, type PatientSurveyFormValues } from '../utils/validations';
import { db } from '../db/db';
import { apiClient } from '../api/client';
import { ResultCard } from '../components/ResultCard';

const SYMPTOMS_LIST = [
  'Nausea', 'Fever', 'Swelling', 'Severe Headache', 'Heavy Bleeding'
];

const PatientSurvey: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultParams, setResultParams] = useState<{ riskLevel: string, offline: boolean } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientSurveyFormValues>({
    resolver: zodResolver(patientSurveySchema),
  });

  const onSubmit = async (data: PatientSurveyFormValues) => {
    setIsSubmitting(true);
    const flattenedSymptoms = data.symptoms ? data.symptoms.join(', ') : '';
    
    const payload = {
      patientData: {
        name: data.name,
        age: data.age,
        pregnancy_week: data.pregnancy_week,
        village: 'Mobile Client'
      },
      surveyData: {
        weight: data.weight,
        blood_pressure: data.blood_pressure,
        sugar_level: data.sugar_level,
        symptoms: flattenedSymptoms
      }
    };

    if (navigator.onLine) {
      try {
        const patientRes = await apiClient.post('/patients', payload.patientData);
        const surveyRes = await apiClient.post('/survey', {
          ...payload.surveyData,
          patient_id: patientRes.data.id
        });
        setResultParams({ riskLevel: surveyRes.data.risk_level, offline: false });
      } catch (err) {
        console.error("Online API failed, falling back to Dexie", err);
        await saveOffline(payload);
      }
    } else {
      await saveOffline(payload);
    }
    
    setIsSubmitting(false);
  };

  const saveOffline = async (payload: any) => {
    // Basic local rule analysis so user immediately sees color even when offline
    let localRisk = "Green";
    const sym = payload.surveyData.symptoms.toLowerCase();
    const bp = payload.surveyData.blood_pressure;

    if (sym.includes('severe headache') || sym.includes('heavy bleeding')) {
      localRisk = "Red";
    } else {
      try {
          const sys = parseInt(bp.split('/')[0] || "0");
          if (sys >= 160) localRisk = "Red";
          else if (sys >= 140) localRisk = "Yellow";
      } catch (e) {}
    }

    if (localRisk === "Green" && (sym.includes('fever') || sym.includes('nausea'))) {
        localRisk = "Yellow";
    }

    await db.surveys.add({
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    setResultParams({ riskLevel: localRisk, offline: true });
  };

  if (resultParams) {
    return (
      <ResultCard
        riskLevel={resultParams.riskLevel}
        isOffline={resultParams.offline}
        onReset={() => {
          reset();
          setResultParams(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
        <div className="text-center space-y-2 pb-6 border-b border-gray-100">
          <div className="inline-flex items-center justify-center p-3 bg-teal-50 text-teal-700 rounded-full shadow-sm">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Health Survey
          </h1>
          <p className="text-sm text-gray-500 px-4">
            Secure maternal check‑in that your doctor can review from the clinic.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 pt-6"
        >
          {/* Personal Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-teal-700 font-semibold">
              <User className="w-5 h-5" />
              <span>About you</span>
            </div>

            <div className="space-y-1">
              <input
                {...register('name')}
                placeholder="Full name"
                className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="Age"
                  className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {errors.age && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="number"
                  {...register('pregnancy_week', { valueAsNumber: true })}
                  placeholder="Pregnancy week (1–42)"
                  className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {errors.pregnancy_week && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.pregnancy_week.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Clinical Parameters Section */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-teal-700 font-semibold">
              <HeartPulse className="w-5 h-5" />
              <span>Vitals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  {...register('weight')}
                  placeholder="Weight (kg)"
                  className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...register('sugar_level')}
                  placeholder="Blood sugar (mg/dL)"
                  className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                {errors.sugar_level && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.sugar_level.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <input
                {...register('blood_pressure')}
                placeholder="Blood pressure (e.g. 120/80)"
                className="w-full text-base px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
              {errors.blood_pressure && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.blood_pressure.message}
                </p>
              )}
            </div>
          </section>

          {/* Symptoms Section */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-teal-700 font-semibold">
                <ShieldAlert className="w-5 h-5" />
                <span>Symptoms</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Select any that apply
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYMPTOMS_LIST.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-teal-400 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={symptom}
                    {...register('symptoms')}
                    className="w-5 h-5 rounded-md border-gray-300 text-teal-600 focus:ring-teal-500 bg-white accent-teal-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {symptom}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                Submit survey
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientSurvey;
