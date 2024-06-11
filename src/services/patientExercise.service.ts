import { DailyPatientExercise } from "@/interfaces/exercise";
import { apiCaller } from "@/utils";

// TODO: remove mock data
const MOCK_PATIENT_ID = "clx71vozt00029gzgr9me5ixn";

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

export const getDailyPatientExerciseById = async (id: string): Promise<DailyPatientExercise> => {
  try {
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises/today/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface PatientExerciseDTO {
  patientId: string;
  exerciseId: string;
  sets: number;
  patientExerciseId?: string;
}
export const createPatientExercise = async ({
  patientId,
  exerciseId,
  sets,
}: PatientExerciseDTO) => {
  try {
    // const res = await apiCaller.post(`patients/${patientId}/exercises`, {
    const res = await apiCaller.post(`patients/${patientId}/exercises`, {
      patientId,
      exerciseId,
      sets,
    });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const updatePatientExercise = async ({
  patientId,
  exerciseId,
  sets,
  patientExerciseId,
}: PatientExerciseDTO) => {
  try {
    const res = await apiCaller.put(`patients/${patientId}/exercises/${patientExerciseId}`, {
      patientId,
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