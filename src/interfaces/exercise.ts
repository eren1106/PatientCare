export interface Exercise {
  id: string;
  thumnbailUrl: string;
  title: string;
  description: string;
  content?: string;
  videoUrl: string;
  createdDateTime: Date;
  updatedDateTime: Date;
}

export interface PatientExercise {
  id: string;
  exercise: Exercise;
  isCompleted: boolean;
  completedDateTime?: Date;
}