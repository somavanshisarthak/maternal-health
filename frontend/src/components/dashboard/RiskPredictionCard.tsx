import React, { useState } from 'react';
import { Activity } from 'lucide-react';
// import { apiClient } from '../../api/client';

export const RiskPredictionCard: React.FC = () => {
  const [formData, setFormData] = useState({
    pregnancyWeek: '',
    systolicBP: '',
    diastolicBP: '',
    hemoglobin: '',
    bloodSugar: '',
    weight: '',
    symptoms: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'Low' | 'Moderate' | 'High' | null>(null);

  const symptomOptions = ['Headache', 'Swelling', 'Blurry Vision', 'Nausea', 'Vaginal Bleeding'];

  const handleSymptomChange = (sym: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(sym) 
        ? prev.symptoms.filter(s => s !== sym) 
        : [...prev.symptoms, sym]
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call or real if backend is ready
      // const response = await apiClient.post('predict-risk', formData);
      // setResult(response.data.riskLevel);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic mock logic based on inputs
      const sysBP = parseInt(formData.systolicBP || '120');
      if (sysBP >= 140 || formData.symptoms.length >= 2) setResult('High');
      else if (sysBP >= 130 || formData.symptoms.length === 1) setResult('Moderate');
      else setResult('Low');
    } catch (error) {
      console.error(error);
      setResult('Moderate'); // mock fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Quick Risk Prediction</h3>
      </div>
      
      <form onSubmit={handlePredict} className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pregnancy Week</label>
            <input type="number" required value={formData.pregnancyWeek} onChange={e => setFormData({...formData, pregnancyWeek: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. 28" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input type="number" required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. 65" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Systolic BP</label>
            <input type="number" required value={formData.systolicBP} onChange={e => setFormData({...formData, systolicBP: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="120" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Diastolic BP</label>
            <input type="number" required value={formData.diastolicBP} onChange={e => setFormData({...formData, diastolicBP: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="80" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hemoglobin (g/dL)</label>
            <input type="number" step="0.1" required value={formData.hemoglobin} onChange={e => setFormData({...formData, hemoglobin: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="12.5" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Blood Sugar (mg/dL)</label>
            <input type="number" required value={formData.bloodSugar} onChange={e => setFormData({...formData, bloodSugar: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="95" />
          </div>
        </div>

        <div>
           <label className="block text-xs font-medium text-gray-700 mb-2">Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map(sym => (
              <button
                key={sym}
                type="button"
                onClick={() => handleSymptomChange(sym)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  formData.symptoms.includes(sym)
                    ? 'bg-teal-100 border-teal-300 text-teal-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-4">
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Running Analysis...' : 'Run Prediction'}
          </button>
          
          {result && (
            <div className={`p-4 rounded-xl text-center font-bold border transition-all ${
              result === 'High' ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' :
              result === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' :
              'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
            }`}>
              Prediction Result: {result} Risk
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
