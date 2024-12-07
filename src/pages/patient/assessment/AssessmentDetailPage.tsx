import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getAssessmentDetails,
  AssessmentDetails,
  createAssessmentResponse,
} from "@/services/assessment.service";
import useLoading from "@/hooks/useLoading.hook";
import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import GenericFormField from "@/components/GenericFormField";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
const AssessmentSchema = z.object({
  sections: z.array(
    z.object({
      sectionId: z.string(),
      questions: z.array(
        z.object({
          questionId: z.string(),
          optionId: z.string().nullable(),
          responseId: z.string(),
        })
      ),
    })
  ),
});

type AssessmentSchemaType = z.infer<typeof AssessmentSchema>;
const AssessmentDetailPage = () => {
  const form = useForm<AssessmentSchemaType>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      sections: [],
    },
  });

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { isLoading, withLoading } = useLoading();
  const [assessmentDetails, setAssessmentDetails] =
    useState<AssessmentDetails | null>(null);

  const location = useLocation();
  const assessmentDetail = location.state?.assessmentDetails;
  const isCompleted = assessmentDetail?.status === "Completed";

  const fetchAssessmentDetails = async (id: string) => {
    try {
      const result = await getAssessmentDetails(id);
      setAssessmentDetails(result);
      form.reset({
        sections: result.sections.map((section) => ({
          sectionId: section.sectionId,
          questions: section.questions.map((question) => ({
            questionId: question.id,
            optionId: question.answer || "",
            responseId: question.responseId,
          })),
        })),
      });
    } catch (e) {
      console.error("Failed to fetch assessment details", e);
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     withLoading(() => fetchAssessmentDetails(id));
  //   }
  // }, [id]);

  useEffect(() => {
    if (!assessmentDetails && id) {
      withLoading(() => fetchAssessmentDetails(id));
    } else {
      setAssessmentDetails(assessmentDetail);
    }
  }, [id, assessmentDetail]);

  const onSubmit = async (data: AssessmentSchemaType) => {
    try {
      if (id) {
        const cleanedData = data.sections.flatMap((section) =>
          section.questions
            .filter(
              (question) =>
                question.optionId !== null && question.optionId !== ""
            )
            .map((question) => ({
              assessmentId: id,
              questionId: question.questionId,
              optionId: question.optionId as string,
              responseId: question.responseId,
            }))
        );

        await createAssessmentResponse(cleanedData);

        toast({
          variant: "success",
          title: "Assessment Response Submitted Successfully",
          description: "The assessment response has been submitted.",
        });
        navigate("/assessment");
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Assessment Response Submission Failed",
        description: "The assessment response has not been submitted.",
      });
    }
  };

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleSaveClick = () => {
    setIsSaveDialogOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    navigate("/assessment");
  };

  return (
    <Card className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="bg-red-100 rounded-md p-5 mb-2">
            <h1 className="text-2xl font-bold ">{assessmentDetails?.title}</h1>
            <p className="text-sm text-gray-600">
              {assessmentDetails?.description}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {assessmentDetails ? (
                <div className="flex flex-col gap-5">
                  {assessmentDetails.sections.map((section, sectionIndex) => (
                    <div
                      key={section.sectionId}
                      className="bg-slate-100 rounded-md p-5"
                    >
                      <h2 className="text-xl font-semibold">
                        Section {sectionIndex + 1} : {section.sectionName}
                      </h2>
                      
                      <p className="text-sm text-gray-600">
                        {section.sectionDescription}
                      </p>
                      {section.questions.map((question, questionIndex) => (
                        <div key={question.title} className="mt-4">
                          {isCompleted ? (
                            // Read-only view for completed assessments
                            <div className="space-y-2">
                              <p className="font-medium">{question.title}</p>
                              <div className="pl-4 flex flex-col sm:flex-row gap-2">
                                {question.options.map((option) => {
                                  const isSelected =
                                    option.optionId === question.answer;
                                  return (
                                    <div
                                      key={option.optionId}
                                      className={`p-2 rounded ${
                                        isSelected ? "bg-blue-100" : ""
                                      }`}
                                    >
                                      <span
                                        className={
                                          isSelected ? "font-bold" : ""
                                        }
                                      >
                                        {option.content} ({option.scaleValue})
                                        {isSelected && " ✓"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // Interactive form for non-completed assessments
                            <GenericFormField
                              control={form.control}
                              name={`sections.${sectionIndex}.questions.${questionIndex}.optionId`}
                              label={`${question.title}`}
                              type="option"
                              options={question.options.map((option) => ({
                                value: option.optionId,
                                label:
                                  (option?.content ?? "") + option.scaleValue ||
                                  "",
                              }))}
                              placeholder="Select an option"
                              noLabel={false}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No assessment details available.</p>
              )}

              {!isCompleted && (
                <div className="flex gap-5">
                  <Button
                    type="button"
                    disabled={form.formState.isSubmitting}
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                  <Button variant="destructive" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to submit the assessment?
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsSaveDialogOpen(false);
                form.handleSubmit(onSubmit)();
              }}
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            If you quit, your progress will be lost. Are you sure you want to
            cancel?
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Yes, Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AssessmentDetailPage;
