export interface Exercise {
  id: string;
  exerciseCategoryId: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  content?: string;
  videoUrl?: string;
  createdDatetime: Date | string;
  updatedDatetime?: Date | string;
}

export interface DailyPatientExercise {
  id: string;
  patientId: string;
  patientExercise: PatientExercise;
  isCompleted: boolean;
  createdDatetime: Date | string;
  completedDatetime?: Date | string;
}

export interface PatientExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  createdDatetime: Date | string;
}
