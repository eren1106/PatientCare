// Options
interface Option {
  id: number;
  content: string;
  questionId: string;
}

// Question type
interface FieldType {
  id: string,
  name: string
}

// Single question
interface Question {
  id: number;
  title: string;
  fieldTypeId: string,
  option: Option[];
  fieldType: FieldType
}

// Questionnaire
export interface Questionnaire {
  id: string,
  title: string;
  description: string;
  type: string;
  authorId: string;
  question: Question[];
  createdDatetime: Date;
  updatedDatetime: Date;
}

export interface Assessment {
  id : string,
  userId : string,
  questionnaireId : string,
  createdDatetime : Date;
  patientRecordId : string,
  questionnaire : Questionnaire;
}

export interface CreateAssessment {
  userId : string,
  questionnaireId : string,
  recordId : string
}