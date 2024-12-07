import { MOCK_PATIENT_ID } from "@/constants";
import { DailyPatientExercise, ExerciseCompetionSummary } from "@/interfaces/exercise";
import { apiRequest } from "@/utils/apiRequest";

export const getPatientExercisesByPatientId = async (patientId: string) => {
  try {
    // const res = await apiRequest.get(`patient-exercises`);
    const res = await apiRequest.get(`patient-exercises/patient/${patientId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getDailyPatientExercises = async (patientId: string): Promise<DailyPatientExercise[]> => {
  try {
    const res = await apiRequest.get(`patient-exercises/patient/${patientId}/today`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const getDailyPatientExerciseById = async (patientId: string, id: string): Promise<DailyPatientExercise> => {
  try {
    const res = await apiRequest.get(`patient-exercises/patient/${patientId}/${id}/today`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAllTimeDailyPatientExercises = async (patientId: string): Promise<DailyPatientExercise[]> => {
  try {
    const res = await apiRequest.get(`patient-exercises/patient/${patientId}/all-daily`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getExerciseCompletionSummaryByPatientId = async (patientId: string): Promise<ExerciseCompetionSummary[]> => {
  try {
    const res = await apiRequest.get(`patient-exercises/patient/${patientId}/completion-summary`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getPatientExerciseById = async (id: string) => {
  try {
    const res = await apiRequest.get(`patient-exercises/${id}`);
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
    // const res = await apiRequest.post(`patient-exercises`, {
    const res = await apiRequest.post(`patient-exercises/patient/${data.patientId}`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const updatePatientExercise = async (data: PatientExerciseDTO) => {
  try {
    const res = await apiRequest.put(`patient-exercises/${data.patientExerciseId}`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const completePatientExercise = async (patientExerciseId: string) => {
  try {
    await apiRequest.put(`patient-exercises/${patientExerciseId}/complete-exercise`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deletePatientExerciseById = async (id: string) => {
  try {
    const res = await apiRequest.delete(`patient-exercises/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};