import { apiCaller } from "@/utils";

export const getAllAssessmentsByPatientId = async (patientId: string): Promise<PatientAssessment[]> => {
    try {
      const res = await apiCaller.get(`assessment/patient/${patientId}`);
      return res.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
};

export const getAssessmentDetails = async (assessmentId: string): Promise<AssessmentDetails> => {
  try {
    const res = await apiCaller.get(`assessment/${assessmentId}/details`);
    return res.data.result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createAssessmentResponse = async (response: CreateResponse[]) => {
  try {
    const res = await apiCaller.post(`assessment/response`, { response });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export interface PatientAssessment {
    assessmentId : string;
    questionnaireName : string;
    questionnaireType : string;
    status : string;
    doctorName : string;
    doctorEmail : string;
    profileImageUrl : string;
    assignedDate : Date;
}

export interface AssessmentDetails {
  title: string;
  description: string;
  sections: SectionDetails[];
}

export interface SectionDetails {
  sectionId: string;
  sectionName: string;
  sectionDescription: string;
  questions: QuestionDetails[];
}

export interface QuestionDetails {
  id : string;
  title: string;
  options: OptionDetails[];
  answer: string | null;
  responseId: string;
}

export interface OptionDetails {
  optionId: string;
  scaleValue: number;
  content: string | null;
}

export interface CreateResponse {
  responseId: string;
  assessmentId: string;
  questionId: string;
  optionId: string;
}
