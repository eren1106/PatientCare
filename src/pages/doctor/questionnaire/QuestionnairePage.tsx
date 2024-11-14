import QuestionnaireTable from "./components/QuestionnaireTable";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { Questionnaire } from "@/interfaces/questionnaire";
import { deleteQuestionnaire, getAllQuestionnaire } from "@/services/questionnaire.service";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const QuestionnairePage = () => {
  const { toast } = useToast();

  const { isLoading, withLoading } = useLoading();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const navigate = useNavigate();
  const getData = async () => {
    const data = await getAllQuestionnaire();
    setQuestionnaire(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, [isDeleted]);

  const handleClickDelete = async (id: string) => {
    try {
      await deleteQuestionnaire(id);

      toast({
        variant: "success",
        title: "Questionnaire Deleted Successfully",
      });
      setIsDeleted(true);
    }
    catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e.response.data.message}`,
      });
    }
  }


  const handleClickCreate = () => {
    navigate('/dashboard/questionnaire/create');
  }


  return (
    <div>
      <div className="border border-gray-300 rounded-lg p-5 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Questionnaire</span>
          <Button size="sm" onClick={handleClickCreate}>Create Questionnaire</Button>
        </div>

        <QuestionnaireTable
          questionnaires={questionnaire}
          loading={isLoading}
          onDelete={handleClickDelete}
        />
      </div>
    </div>
  )
}

export default QuestionnairePage

