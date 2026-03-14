import { useEffect } from 'react';
import { db } from '../db/db';
import { apiClient } from '../api/client';

export const useSyncManager = () => {
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Network connected. Attempting to sync offline surveys...');
      
      const pendingSurveys = await db.surveys.where('status').equals('pending').toArray();
      
      if (pendingSurveys.length === 0) {
        return;
      }
      
      for (const survey of pendingSurveys) {
        try {
          // 1. Create Patient
          const patientRes = await apiClient.post('/patients', {
            ...survey.patientData,
            village: survey.patientData.village || 'Unknown' // Supply default if skipped offline
          });
          
          const patientId = patientRes.data.id;
          
          // 2. Submit Survey tied to new patient
          await apiClient.post('/survey', {
            ...survey.surveyData,
            patient_id: patientId
          });
          
          // 3. Mark as synced locally
          await db.surveys.update(survey.id!, { status: 'synced' });
          console.log(`Successfully synced survey ${survey.id}`);
          
        } catch (error) {
          console.error(`Failed to sync survey ${survey.id}:`, error);
        }
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};
