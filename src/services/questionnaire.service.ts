import { Assessment, CreateAssessment, OptionTemplate, Questionnaire, Section, UpdateQuestionnaire } from "@/interfaces/questionnaire";
import { apiCaller } from "@/utils";
import { getCurrentUser } from "./auth.service";
import { Exercise } from "@/interfaces/exercise";

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


export const getAssessmentsByPatientRecordId = async (id : string): Promise<Assessment[]> => {
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

export const getAssessmentResult = async (assessmentId : string): Promise<AssessmentResult> => {
  try {
    const res = await apiCaller.get(`questionnaire/assessment/${assessmentId}/result`);
    return res.data;
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

export const getAllOptionTemplates = async (): Promise<OptionTemplate[]> => {
  try {
    const res = await apiCaller.get('questionnaire/optionTemplate');
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createOptionTemplate = async (data: CreateOptionTemplateRequest) => {
  try {
    const res = await apiCaller.post('questionnaire/optionTemplate', data);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateOptionTemplate = async (id: string, data: UpdateOptionTemplate) => {
  try {
    const res = await apiCaller.put(`questionnaire/optionTemplate/${id}`, data);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteOptionTemplate = async (id: string) => {
  try {
    const res = await apiCaller.delete(`questionnaire/optionTemplate/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export interface UpdateOptionTemplate {
  scaleType: string;
  options: Option[];
}

export interface Option {
  id? : string;
  scaleValue: number;
  content: string;
}

export interface CreateOptionTemplateRequest {
  scaleType: string;
  options: Option[];
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

export interface AssessmentResult {
  questionnaireName: string;
  questionnaireType: string;
  exerciseSuggestions: ExerciseSuggestion[] | [];
  questionnaireIndex: string;
  questionnaireStatus: string;
  sectionScores: SectionScore[];
  totalScore: number;
}

export interface ExerciseSuggestion {
  id : string;
  analysis : string;
  suggestion : Suggestion[];
}

export interface Suggestion {
  id : string;
  exerciseTitle : string;
  exerciseId : string;
}
export interface SectionScore {
  sectionName: string;
  sectionScore: number;
  sectionTotalScore: number;
  questions: QuestionScore[];
}

export interface QuestionScore {
  questionId: string;
  questionTitle: string;
  response: Response | null;
}

export interface Response {
  scaleValue: number;
  content: string | null;
}

