import { MOCK_QUESTIONNAIRE } from "@/constants/mocks"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";

const QuestionnairePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
    <h1 className="text-3xl font-semibold mb-6">{MOCK_QUESTIONNAIRE.title}</h1>
    <p className="mb-6 text-gray-700">{MOCK_QUESTIONNAIRE.description}</p>
    {MOCK_QUESTIONNAIRE.questions.map((question) => (
      <div key={question.id} className="mb-6">
        <label className="block text-xl font-medium text-gray-700 mb-2">{question.text}</label>
        <RadioGroup>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={`question-${question.id}-option-${option.id}`} id={`question-${question.id}-option-${option.id}`} />
              <Label htmlFor={`question-${question.id}-option-${option.id}`}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    ))}
    <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Submit
    </button>
  </div>
  )
}

export default QuestionnairePage