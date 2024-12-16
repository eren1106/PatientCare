import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssessmentNavigationBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

const AssessmentNavigationBar = ({
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
  onNavigate,
}: AssessmentNavigationBarProps) => {
  const getCircleColor = (index: number) => {
    if (currentQuestionIndex === index) return "bg-red-100";
    if (answeredQuestions.has(index)) return "bg-green-100";
    return "bg-gray-100";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg font-medium">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3 gap-x-5">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`${getCircleColor(
                index
              )} w-8 h-8 rounded-full flex items-center justify-center 
              hover:opacity-80 transition-all ${
                currentQuestionIndex === index ? "ring-2 ring-red-400" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentNavigationBar;