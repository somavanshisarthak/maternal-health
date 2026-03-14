import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../api/client';

export type RiskLevel = 'Green' | 'Yellow' | 'Red' | string | null;

export interface Patient {
  id: number;
  name: string;
  village: string;
  pregnancy_week: number;
  latest_checkup_date?: string | null;
  risk_level?: RiskLevel;
}

export const usePatients = () => {
  return useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await apiClient.get<Patient[]>('/patients');
      return response.data;
    },
  });
};

