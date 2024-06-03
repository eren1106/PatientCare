import { PatientExercise } from "@/interfaces/exercise";
import { apiCaller } from "@/utils";

const MOCK_PATIENT_ID = "5b6a2166-a05e-423a-bf62-00e556543477";

export const getPatientExercises = async (): Promise<PatientExercise[]> => {
  try {
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const completePatientExercise = async (patientExerciseId: number) => {
  try {
    await apiCaller.put(`patients/${MOCK_PATIENT_ID}/exercises/${patientExerciseId}/complete-exercise`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};