import DialogButton from "@/components/DialogButton";
//import QuestionnaireForm from "./components/ExerciseForm";
import QuestionnaireTable from "./components/QuestionnaireTable";
import QuestionnaireDetailsPage from "./QuestionnaireDetailsPage";
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
  const [selectedEditQuestionnaire, setSelectedEditQuestionnaire] = useState<Questionnaire | null>(null);
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


  
  const handleClickEdit = (questionnaire: Questionnaire) => {
    setSelectedEditQuestionnaire(questionnaire);
    setShowEditModal(true);
  }

  const handleClickCreate = () => {
    navigate('/dashboard/questionnaire/create');
  }


  return (
    <div>
      <div className="border border-gray-300 rounded-lg p-5 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Questionnaire</span>
          <Button onClick={handleClickCreate}>Create Questionnaire</Button>
        </div>

        <QuestionnaireTable
          questionnaires={questionnaire}
          loading={isLoading}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>

      {/* TODO: MAKE CREATE & EDIT THE SAME COMPONENT */}
      {/* EDIT Questionnaire MODAL */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[42rem]">
          <DialogHeader>
            <DialogTitle>Edit Questionnaire</DialogTitle>
          </DialogHeader>
          {/* {selectedEditQuestionnaire ? <QuestionnaireForm Questionnaire={selectedEditQuestionnaire}/> : "No Questionnaire selected!"} */}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionnairePage

