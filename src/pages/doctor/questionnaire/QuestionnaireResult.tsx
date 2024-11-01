import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssessmentResult , AssessmentResult} from '@/services/questionnaire.service';
import Spinner from '@/components/Spinner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QuestionnaireResult = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const fetchAssessmentResult = async (id: string) => {
    try {
      const result = await getAssessmentResult(id);
      setResult(result);
    } catch (e) {
      console.error('Failed to fetch assessment result', e);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAssessmentResult(id);
    }
  }, [id]);

  return (
    <Card className="p-6 bg-slate-100">
      <h1 className="text-2xl font-bold mb-6">Questionnaire Result</h1>
      {result ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <p><strong>Name:</strong> {result.questionnaireName}</p>
            <p><strong>Type:</strong> {result.questionnaireType}</p>
            <p><strong>Index:</strong> {result.questionnaireIndex}</p>
            <p><strong>Status:</strong> <Badge variant="default">{result.questionnaireStatus}</Badge></p>
            <p><strong>Total Score:</strong> {result.totalScore}</p>
          </div>
          <Separator />
          <Accordion type="single" collapsible className="w-full">
            {result.sectionScores.map((section, sectionIndex) => (
              <AccordionItem key={sectionIndex} value={`item-${sectionIndex}`}>
                <AccordionTrigger>
                  <div className="flex flex-col items-start"> 
                  {section.sectionName}
                  <p className="text-sm text-gray-600"><strong>Score:</strong> {section.sectionScore} / {section.sectionTotalScore}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  
                  <div className="mt-4 space-y-3">
                    {section.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                        <p className="text-sm"><strong>Question:</strong> {question.questionTitle}</p>
                        <p className="text-sm"><strong>Response:</strong> {question.response ? question.response.scaleValue : 'No response'}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}
    </Card>
  );
};

export default QuestionnaireResult;