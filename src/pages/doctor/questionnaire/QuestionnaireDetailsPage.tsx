import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import useLoading from "@/hooks/useLoading.hook";
import { Questionnaire } from "@/interfaces/questionnaire";
import {
  getQuestionnaireById,
} from "@/services/questionnaire.service";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditQuestionnaireForm from "./EditQuestionnaireForm";
import { useIsAdmin } from "@/hooks/useIsAdmin.hook";

const QuestionnaireDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, withLoading } = useLoading();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  const getData = async () => {
    if (id) {
      const data = await getQuestionnaireById(id);
      setQuestionnaire(data);
    }
  };

  useEffect(() => {
    withLoading(getData);
  }, [id]);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    withLoading(getData);
  }

  const isUserAdmin = useIsAdmin();
  
  const handleNavigation = () => {
    navigate("/dashboard/questionnaire");
  }

  return (
    <Card className="p-5">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleNavigation}>
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl text-center">{questionnaire?.title}</h1>
            {isUserAdmin && (
              <Button variant="secondary" onClick={handleEditClick}>
              {isEditing ? "Cancel" : <Edit size={16} />}
            </Button>
            )}
            
          </div>

          {isEditing ? (
            <EditQuestionnaireForm questionnaire={questionnaire} onHandleEdit={handleCancelEdit}/>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <p>{questionnaire?.description}</p>
              {questionnaire?.sections.map((section, sectionIndex) => (
                <div
                  className="p-5 bg-blue-100 rounded-md space-y-3"
                  key={section.id}
                >
                  <h2>
                    Section {sectionIndex + 1} : {section.name}
                  </h2>
                  <p>{section.description}</p>
                  {section.question.map((question, questionIndex) => (
                    <div className="flex flex-col gap-2" key={question.id}>
                      <p>
                        {questionIndex + 1}. {question.title}
                      </p>
                      <RadioGroup>
                        <div className="flex flex-wrap gap-2">
                          {question.optionTemplate?.option.map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center justify-center border border-black px-4 py-2 cursor-pointer space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.scaleValue.toString()}
                                  id={`${question.id}-${option.scaleValue}`}
                                />
                                <Label
                                  htmlFor={`${question.id}-${option.scaleValue}`}
                                >
                                  {option.content} ({option.scaleValue})
                                </Label>
                              </div>
                            )
                          )}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default QuestionnaireDetailsPage;
