import { Assessment, CreateAssessment, Questionnaire } from "@/interfaces/questionnaire";
import { apiCaller } from "@/utils";
import { MOCK_DOCTOR_ID } from "@/constants";


export const getAllQuestionnaire = async (): Promise<Questionnaire[]> => {
    try {
      const res = await apiCaller.get(`questionnaire`);
      return res.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
}


export const getAssessmentsByPatientId = async (id : string): Promise<Assessment[]> => {
  try {
    const res = await apiCaller.get(`questionnaire/patient/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getQuestionnaireById = async (id : string): Promise<Questionnaire> => {
  try {
    const res = await apiCaller.get(`questionnaire/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const insertQuestionnaire = async (questionnaire : CreateQuestionnaire) => {
  try {
    const res = await apiCaller.post(`questionnaire/create`, { questionnaire, authorId: MOCK_DOCTOR_ID });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const insertAssessment = async (assessment : CreateAssessment) => {
  try {
    const res = await apiCaller.post(`questionnaire/assessment`, { assessment });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const deleteQuestionnaire = async (questionnaireId : string) => {
  try {
    const res = await apiCaller.put(`questionnaire/${questionnaireId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const deleteAssessment = async (assessmentId : string) => {
  try {
    const res = await apiCaller.delete(`questionnaire/assessment/${assessmentId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

interface CreateOption {
  content: string;
}

interface CreateQuestion {
  title: string;
  type: 'Multiple Choice' | 'Text';
  options?: CreateOption[];
}

export interface CreateQuestionnaire {
  title: string;
  description: string;
  type: 'General' | 'Shoulder' | 'Knee';
  questions: CreateQuestion[];
}

