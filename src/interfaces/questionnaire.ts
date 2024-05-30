// Options
interface Option {
  id: number;
  text: string;
}

// Single question
interface Question {
  id: number;
  text: string;
  options: Option[];
}

// Questionnaire
interface Questionnaire {
  title: string;
  description: string;
  questions: Question[];
}
