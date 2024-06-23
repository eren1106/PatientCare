import AutoResizeTextarea from "@/components/AutoResizeTextarea";
import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import useLoading from "@/hooks/useLoading.hook";
import { Questionnaire } from "@/interfaces/questionnaire";
import { getQuestionnaireById } from "@/services/questionnaire.service";
import { RadioGroup } from "@radix-ui/react-radio-group";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuestionnaireDetailsPage = () => {
  const { id } = useParams();
  const { isLoading, withLoading } = useLoading();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();

  const getData = async () => {
    console.log(id);
    if (id) {
      const data = await getQuestionnaireById(id);
      setQuestionnaire(data);
    }
  };

  useEffect(() => {
    withLoading(getData);
  }, []);
  return (
    <Card className="p-5">
      {isLoading && <Spinner />}
      {!isLoading && questionnaire && (
        <>
          <header className="flex flex-col gap-2">
            <h1>{questionnaire.title}</h1>
            <p>{questionnaire.description}</p>
          </header>

          <Card className="mt-2 p-5 rounded-lg bg-light-blue">
            <h2>Questions</h2>
            {questionnaire.question.map((question, index) => (
              <div key={question.id} className="flex flex-col gap-2">
                <h3>{index + 1}.  {question.title}</h3>
                {question.fieldType.name === 'Multiple Choice' && (
                  <RadioGroup className="flex flex-col gap-1 p-3">
                  {question.option.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 ">
                      <RadioGroupItem value={`question-${question.id}-option-${option.id}`} id={`question-${question.id}-option-${option.id}`} />
                      <Label htmlFor={`question-${question.id}-option-${option.id}`}>{option.content}</Label>
                    </div>
                  ))}
                </RadioGroup>
                )}
                {question.fieldType.name === 'Text' && (
                  <AutoResizeTextarea />
                )}
              </div>
            ))}
          </Card>
        </>
      )}
      {!isLoading && !questionnaire && (
        <p>Questionnaire not found</p>
      )}
    </Card>
  );
};

export default QuestionnaireDetailsPage;
