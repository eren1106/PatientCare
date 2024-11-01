// Questionnaire
export interface Questionnaire {
  id: string,
  title: string;
  description: string;
  type: string;
  index: string
  authorId: string;
  sections: Section[];
  createdDatetime?: Date;
  updatedDatetime?: Date;
  isDelete: boolean;
}

export interface UpdateQuestionnaire {
  title: string;
  description: string;
  sections: Section[];
}

export interface Section {
  id : string;
  name: string;
  description: string;
  questionnaireId : string;
  question : Question[]; 
}

// Single question
export interface Question {
  id: string;
  title: string;
  sectionId?: string;
  optionId: string;
  optionTemplate? : OptionTemplate;
}

export interface OptionTemplate {
  id:string;
  scaleType: string;
  option: Option[]
}

// Options
interface Option {
  id: string;
  optionTemplateId : string;
  scaleValue : number;
  content? : string;
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
  doctorId : string,
  questionnaireId : string,
  recordId : string
}