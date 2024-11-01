import DialogButton from "@/components/DialogButton";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading.hook";
import Combobox from "@/components/Combobox";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { refreshPage } from "@/utils";
import { CreateAssessment, Questionnaire } from "@/interfaces/questionnaire";
import {
  deleteAssessment,
  getAllQuestionnaire,
  getAssessmentsByPatientRecordId,
  insertAssessment,
} from "@/services/questionnaire.service";
import PatientQuestionnaireTable from "./PatientQuestionnaireTable";
import { Assessment } from "@/interfaces/questionnaire";
import { getCurrentUser } from "@/services/auth.service";
import { get } from "http";

const QuestionnaireSchema = z.object({
  id: z.string().min(1, "Select at least one questionnaire"),
});

const PatientRecordQuestionnaireTab = ({
  patientId,
  recordId,
}: {
  patientId: string;
  recordId: string;
}) => {
  const { isLoading, withLoading } = useLoading();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<Assessment[]>([]);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire[]>([]);
  const [isDeleted, setIsDeleted] = useState<number>(0);

  const getData = async () => {
    const data = await getAssessmentsByPatientRecordId(recordId);

    setAssessment(data);

    const questionnaire = await getAllQuestionnaire();
    setQuestionnaire(questionnaire);
  };

  useEffect(() => {
    withLoading(getData);
  }, [isDeleted]);

  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof QuestionnaireSchema>) => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id) {
      const questionnaireId = data.id;
      const doctorId = currentUser.id;
      const assessmentData: CreateAssessment = {
        doctorId,
        questionnaireId,
        recordId,
      };
      try {
        await insertAssessment(assessmentData);
        toast({
          variant: "success",
          title: "Assessment Assigned Successfully",
          description: "The assessment has been assigned to the patient",
        });
        refreshPage();
      } catch (e: any) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Assessment Assigned Failed",
          description: `${e.response.data.message}`,
        });
      }
    }
  };

  const handleSelectQuestionnaire = (id: string) => {
    form.setValue("id", id);
  };

  const handleClickDelete = async (id: string) => {
    try {
      await deleteAssessment(id);

      toast({
        variant: "success",
        title: "Unassigned Questionnaire Successfully",
      });
      setIsDeleted((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e}`,
      });
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2>Assigned Questionnaire</h2>

        {/* Assign Patient Questionnaire */}
        <DialogButton
          variant="default"
          title="Assign Questionnaire"
          content={
            <div className="flex flex-col gap-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="id"
                    render={() => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Questionnaire</FormLabel>
                        <FormControl>
                          <Combobox
                            items={questionnaire.map((questionnaire) => ({
                              label: questionnaire.title,
                              value: questionnaire.id,
                            }))}
                            onSelect={handleSelectQuestionnaire}
                            placeholder="Select Questionnaire..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          }
        >
          Assign Questionnaire
        </DialogButton>
      </div>
      <PatientQuestionnaireTable
        onDelete={handleClickDelete}
        assessment={assessment}
      />
    </div>
  );
};

export default PatientRecordQuestionnaireTab;
