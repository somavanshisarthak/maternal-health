import { z } from 'zod';

export const patientSurveySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(12, 'Must be a valid age').max(65, 'Must be a valid age'),
  pregnancy_week: z.number().min(1, 'Cannot be less than 1').max(42, 'Cannot exceed 42 weeks'),
  weight: z.string().min(1, 'Required'),
  blood_pressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, 'Must be formatted as SYS/DIA (e.g. 120/80)'),
  sugar_level: z.string().min(1, 'Required'),
  symptoms: z.array(z.string()),
});

export type PatientSurveyFormValues = z.infer<typeof patientSurveySchema>;
