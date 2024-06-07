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
  createdDatetime: string;
  updatedDatetime?: string;
}

export interface DailyPatientExercise {
  id: string;
  patientId: string;
  // patientExerciseId: string;
  patientExercise: PatientExercise;
  isCompleted: boolean;
  createdDatetime: string;
  completedDatetime?: string;
}

export interface PatientExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  createdDatetime: string;
}
