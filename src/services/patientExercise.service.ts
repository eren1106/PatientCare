import { DailyPatientExercise } from "@/interfaces/exercise";
import { apiCaller } from "@/utils";

const MOCK_PATIENT_ID = "clwyqwafm0002570bgxcr8wwd";

export const getPatientExercisesByPatientId = async (patientId: string) => {
  try {
    // const res = await apiCaller.get(`patients/${patientId}/exercises`);
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getDailyPatientExercises = async (): Promise<DailyPatientExercise[]> => {
  try {
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises/today`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface CreatePatientExerciseDTO {
  patientId: string;
  exerciseId: string;
  sets: number;
}
export const createPatientExercise = async ({
  patientId,
  exerciseId,
  sets,
}: CreatePatientExerciseDTO) => {
  try {
    const res = await apiCaller.post(`patients/${patientId}/exercises`, {
      patientId: MOCK_PATIENT_ID,
      exerciseId,
      sets,
    });
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

export const deletePatientExerciseById = async (id: string) => {
  try {
    const res = await apiCaller.delete(`patients/${MOCK_PATIENT_ID}/exercises/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};