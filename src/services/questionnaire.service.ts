import { Assessment, CreateAssessment, OptionTemplate, Questionnaire, Section, UpdateQuestionnaire } from "@/interfaces/questionnaire";
import { apiCaller } from "@/utils";
import { getCurrentUser } from "./auth.service";

export const getAllQuestionnaire = async (): Promise<Questionnaire[]> => {
    try {
      const res = await apiCaller.get(`questionnaire`);
      return res.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
}

export const getOptions = async (): Promise<OptionTemplate[]> => {
  try {
    const res = await apiCaller.get(`questionnaire/options`);
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
    const res = await apiCaller.post(`questionnaire/create`, { questionnaire });
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
    const res = await apiCaller.delete(`questionnaire/${questionnaireId}`);
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


export const updateQuestionnaire = async (id: String, data : UpdateQuestionnaire) => {
  try {
    const res = await apiCaller.put(`questionnaire/${id}`, data);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}


interface CreateQuestion {
  title: string;
  optionId: string;
}

export interface CreateQuestionnaire {
  title: string;
  description: string;
  type: 'General' | 'Shoulder' | 'Knee';
  index: string;
  authorId: string;
  sections: CreateSection[];
}

export interface CreateSection {
  name: string;
  description: string;
  questions: CreateQuestion[];
}

