import { DailyPatientExercise } from "@/interfaces/exercise";
import { apiCaller } from "@/utils";

const MOCK_PATIENT_ID = "clwyqwafm0002570bgxcr8wwd";

export const getDailyPatientExercises = async (): Promise<DailyPatientExercise[]> => {
  try {
    // const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises/today`);
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises/today`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const completePatientExercise = async (patientExerciseId: string) => {
  try {
    await apiCaller.put(`patients/${MOCK_PATIENT_ID}/exercises/${patientExerciseId}/complete-exercise`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};