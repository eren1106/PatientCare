export interface Exercise {
  id: number;
  thumnbailUrl: string;
  title: string;
  description: string;
  content?: string;
  videoUrl: string;
  createdDateTime: Date;
  updatedDateTime: Date;
}

export interface PatientExercise {
  id: number;
  exercise: Exercise;
  isCompleted: boolean;
  createdDateTime: Date;
  completedDateTime?: Date;
}