import { MOCK_PATIENT_ID } from "@/constants";
import { DailyPatientExercise, ExerciseCompetionSummary } from "@/interfaces/exercise";
import { apiRequest } from "@/utils/apiRequest";

export const getPatientExercisesByPatientId = async (patientId: string) => {
  try {
    // const res = await apiRequest.get(`patients/${patientId}/exercises`);
    const res = await apiRequest.get(`patients/${patientId}/exercises`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getDailyPatientExercises = async (patientId: string): Promise<DailyPatientExercise[]> => {
  try {
    const res = await apiRequest.get(`patients/${patientId}/exercises/today`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const getDailyPatientExerciseById = async (id: string): Promise<DailyPatientExercise> => {
  try {
    const res = await apiRequest.get(`patients/p/exercises/${id}/today`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAllTimeDailyPatientExercises = async (patientId: string): Promise<DailyPatientExercise[]> => {
  try {
    const res = await apiRequest.get(`patients/${patientId}/exercises/all-daily`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getExerciseCompletionSummaryByPatientId = async (patientId: string): Promise<ExerciseCompetionSummary[]> => {
  try {
    const res = await apiRequest.get(`patients/${patientId}/exercises/completion-summary`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getPatientExerciseById = async (id: string) => {
  try {
    const res = await apiRequest.get(`patients/p/exercises/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

interface PatientExerciseDTO {
  patientId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  frequency: number;
  duration: number;

  patientExerciseId?: string;
}
export const createPatientExercise = async (data: PatientExerciseDTO) => {
  try {
    // const res = await apiRequest.post(`patients/${patientId}/exercises`, {
    const res = await apiRequest.post(`patients/${data.patientId}/exercises`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const updatePatientExercise = async (data: PatientExerciseDTO) => {
  try {
    const res = await apiRequest.put(`patients/${data.patientId}/exercises/${data.exerciseId}`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const completePatientExercise = async (patientExerciseId: string) => {
  try {
    await apiRequest.put(`patients/${MOCK_PATIENT_ID}/exercises/${patientExerciseId}/complete-exercise`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deletePatientExerciseById = async (id: string) => {
  try {
    const res = await apiRequest.delete(`patients/${MOCK_PATIENT_ID}/exercises/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};