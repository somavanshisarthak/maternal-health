import Dexie, { type EntityTable } from 'dexie';

export interface OfflineSurvey {
  id?: number;
  patientData: {
    name: string;
    age: number;
    pregnancy_week: number;
    village?: string;
  };
  surveyData: {
    weight: string;
    blood_pressure: string;
    sugar_level: string;
    symptoms: string;
  };
  status: 'pending' | 'synced';
  createdAt: string;
}

const db = new Dexie('MaternalHealthDB') as Dexie & {
  surveys: EntityTable<OfflineSurvey, 'id'>;
};

db.version(2).stores({
  surveys: '++id, status'
});

export { db };
