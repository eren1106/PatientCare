import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getAssessmentDetails,
  AssessmentDetails,
  createAssessmentResponse,
} from "@/services/assessment.service";
import useLoading from "@/hooks/useLoading.hook";
import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GenericFormField from "@/components/GenericFormField";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import AssessmentNavigationBar from "./AssessmentNavigationBar";
import { AssessmentHeader } from "./AssessmentHeader";
import DynamicDialogTrigger from "@/components/DynamicDialogTrigger";
import { useAssessmentNavigation } from "@/hooks/useAssessmentNavigation";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { isLoading, withLoading } = useLoading();
  const [assessmentDetails, setAssessmentDetails] =
    useState<AssessmentDetails | null>(null);

  const location = useLocation();
  const assessmentDetail = location.state?.assessmentDetails;
  const isCompleted = assessmentDetail?.status === "Completed";

  const form = useForm<AssessmentSchemaType>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      sections:
        assessmentDetails?.sections?.map((section) => ({
          sectionId: section.sectionId,
          questions:
            section.questions?.map((question) => ({
              questionId: question.id,
              optionId: null,
              responseId: "",
            })) || [],
        })) || [],
    },
  });

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

  // Pagination
  const navigation = useAssessmentNavigation(assessmentDetails);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const formValues = form.watch();

  useEffect(() => {
    if (!assessmentDetails?.sections) return;

    const newAnsweredQuestions = new Set<number>();

    const currentValues = form.getValues();

    if (!currentValues?.sections) return;

    currentValues.sections.forEach((section, sectionIndex) => {
      if (section?.questions) {
        section.questions.forEach((question, questionIndex) => {
          if (question?.optionId && question.optionId !== "") {
            const absoluteIndex = navigation.getAbsoluteIndex(
              sectionIndex,
              questionIndex
            );
            if (typeof absoluteIndex === "number") {
              newAnsweredQuestions.add(absoluteIndex);
            }
          }
        });
      }
    });

    setAnsweredQuestions(newAnsweredQuestions);
  }, [
    formValues,
    navigation.getAbsoluteIndex,
    assessmentDetails?.sections,
    form,
  ]);
  if (isLoading) return <Spinner />;
  if (!assessmentDetails) return <p>No assessment details available.</p>;

  return (
    <Card className="p-6">
      <div>
        <AssessmentHeader
          title={assessmentDetails.title}
          description={assessmentDetails.description}
        />

        <div
          className={`grid ${
            isCompleted ? "grid-cols-1" : "grid-cols-[1fr,300px]"
          } gap-6 max-w-7xl mx-auto`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {assessmentDetails ? (
                <div className="flex flex-col gap-5">
                  {!isCompleted && navigation.getCurrentSection() && (
                    <Card className="p-1 bg-gradient-to-r from-blue-50 to-blue-100 border-none shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold text-blue-700 flex items-center gap-2">
                          <ClipboardList className="h-6 w-6" />
                          {navigation.getCurrentSection()?.sectionName} Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mt-2">
                          {navigation.getCurrentSection()?.sectionDescription}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-2 border-blue-500 p-6">
                    <div
                      key={navigation.getCurrentQuestion()?.title}
                      className="space-y-4"
                    >
                      {isCompleted ? (
                        // Read-only view logic
                        <div className="space-y-6">
                          {assessmentDetails?.sections?.map(
                            (section, sectionIndex) => (
                              <div
                                key={section.sectionId}
                                className="space-y-4"
                              >
                                <div className="bg-slate-100 rounded-md p-5">
                                  <h2 className="text-xl font-semibold">
                                    Section {sectionIndex + 1}:{" "}
                                    {section.sectionName}
                                  </h2>
                                  <p className="text-sm text-gray-600">
                                    {section.sectionDescription}
                                  </p>
                                </div>

                                {section.questions.map(
                                  (question, questionIndex) => (
                                    <Card
                                      key={question.title}
                                      className="border-2 border-blue-500 p-6"
                                    >
                                      <div className="space-y-2">
                                        <p className="font-medium">
                                          Question {questionIndex + 1}:{" "}
                                          {question.title}
                                        </p>
                                        <div className="pl-4 flex flex-col sm:flex-row gap-2">
                                          {question.options.map((option) => {
                                            const isSelected =
                                              option.optionId ===
                                              question.answer;
                                            return (
                                              <div
                                                key={option.optionId}
                                                className={`p-2 rounded ${
                                                  isSelected
                                                    ? "bg-blue-100"
                                                    : ""
                                                }`}
                                              >
                                                <span
                                                  className={
                                                    isSelected
                                                      ? "font-bold"
                                                      : ""
                                                  }
                                                >
                                                  {option.content} (
                                                  {option.scaleValue})
                                                  {isSelected && " ✓"}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </Card>
                                  )
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <p className="font-bold">
                              Question {navigation.currentQuestionIndex + 1}
                            </p>
                            <p>{navigation.getCurrentQuestion()?.title}</p>
                          </div>
                          <GenericFormField
                            control={form.control}
                            name={`sections.${navigation.currentSectionIndex}.questions.${navigation.currentQuestionIndex}.optionId`}
                            noLabel={true}
                            type="option"
                            options={navigation
                              .getCurrentQuestion()
                              ?.options.map((option) => ({
                                value: option.optionId,
                                label:
                                  (option?.content ?? "") +
                                    " " +
                                    option.scaleValue || "",
                              }))}
                            placeholder="Select an option"
                          />
                        </div>
                      )}
                    </div>
                  </Card>

                  {!isCompleted && (
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={navigation.handlePrevious}
                        disabled={
                          navigation.currentSectionIndex === 0 &&
                          navigation.currentQuestionIndex === 0
                        }
                      >
                        Previous
                      </Button>
                      {navigation.isLastQuestion() ? (
                        <Button
                          type="button"
                          onClick={handleSaveClick}
                          disabled={form.formState.isSubmitting}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button type="button" onClick={navigation.handleNext}>
                          Next
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>No assessment details available.</p>
              )}
            </form>
          </Form>

          {!isCompleted && (
            <div className="sticky">
              <AssessmentNavigationBar
                currentQuestionIndex={navigation.getAbsoluteIndex(
                  navigation.currentSectionIndex,
                  navigation.currentQuestionIndex
                )}
                totalQuestions={navigation.getTotalQuestions()}
                answeredQuestions={answeredQuestions}
                onNavigate={navigation.handleNavigate}
              />
              <Button
                variant="destructive"
                onClick={() => setIsCancelDialogOpen(true)}
                className="w-full mt-4"
              >
                Discard Progress
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <DynamicDialogTrigger
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        title="Confirm Submission"
        description="Are you sure you want to submit the assessment?"
        content={
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
        }
      />

      <DynamicDialogTrigger
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title="Confirm Cancellation"
        description="If you quit, your progress will be lost. Are you sure you want to cancel?"
        content={
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
        }
      />
    </Card>
  );
};

export default AssessmentDetailPage;
