import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm, useFieldArray, Control } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OptionTemplate, Questionnaire } from "@/interfaces/questionnaire";
import { PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getOptions, updateQuestionnaire } from "@/services/questionnaire.service";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import useLoading from '@/hooks/useLoading.hook';
import { useNavigate } from "react-router-dom";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";

interface EditQuestionnaireFormProp {
  questionnaire?: Questionnaire;
  onHandleEdit: () => void;
}

const questionnaireSchema = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      questionnaireId: z.string(),
      question: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          optionId: z.string(),
          // option: z.array(
          //   z.object({
          //     scaleValue: z.number(),
          //     content: z.string().optional(),
          //   })
          // ).optional(),
        })
      ),
    })
  ),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

const EditQuestionnaireForm = ({
  questionnaire,
  onHandleEdit,
}: EditQuestionnaireFormProp) => {

  const navigate = useNavigate();
  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      title: questionnaire?.title ?? "",
      description: questionnaire?.description ?? "",
      sections:
        questionnaire?.sections?.map((section) => ({
          id: section.id,
          name: section.name,
          description: section.description,
          questionnaireId: section.questionnaireId,
          question: section.question.map((question) => ({
            id: question.id,
            title: question.title,
            optionId: question.optionId,
            // option: question.optionTemplate.option.map((opt) => ({
            //   id: opt.id,
            //   scaleValue: opt.scaleValue,
            //   content: opt.content,
            // })),
          })),
        })) ?? [],
    },
  });

  const [options, setOptions] = useState<OptionTemplate[]>([]);
  const fetchOptions = async () => {
    const data = await getOptions();
    setOptions(data);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (questionnaire) {
      form.reset({
        title: questionnaire.title,
        description: questionnaire.description,
        sections: questionnaire.sections.map((section) => ({
          id: section.id,
          name: section.name,
          description: section.description,
          questionnaireId: section.questionnaireId,
          question: section.question.map((question) => ({
            id: question.id,
            title: question.title,
            optionId: question.optionId,
            // option: question.optionTemplate.option.map((opt) => ({
            //   scaleValue: opt.scaleValue,
            //   content: opt.content,
            // })),
          })),
        })),
      });
    }
  }, [questionnaire, form]);

  const {
    fields: sections,
    append: addSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { isLoading, withLoading } = useLoading();

  
  const handleSaveClick = () => {
    setIsSaveDialogOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaveDialogOpen(false);
    await withLoading(async () => {
      await form.handleSubmit(onSubmit)();
    });
  };

  const handleConfirmCancel = () => {
    navigate("/dashboard/questionnaire");
  };


  const onSubmit = async (data: z.infer<typeof questionnaireSchema>) => {
    if(!questionnaire) return;
    try {
      await updateQuestionnaire(questionnaire.id, data);
      toast({
        title: "Update Success",
        variant: "success",
        description: `Successfully updated the questionnaire`
      })
      onHandleEdit();
    } catch (error : any) {
      toast({
        title: "Update Failed",
        variant: "destructive",
        description: `${error.response?.data?.message ?? DEFAULT_ERROR_MESSAGE}`,
      })
      onHandleEdit();
    }
    
  };

  return (
    <>
    <Form {...form}>
      <form className="mt-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 bg-slate-100 p-5 rounded-md mb-5">
          <GenericFormField
            control={form.control}
            name="title"
            label="Title"
            placeholder="Enter questionnaire title"
          />
          <GenericFormField
            control={form.control}
            name="description"
            label="Description"
            type="textarea"
            placeholder="Enter questionnaire description"
          />
        </div>

        {sections.map((section, index) => (
          <SectionField
            key={section.id}
            control={form.control}
            sectionIndex={index}
            sectionId={section.id}
            questionnaire={questionnaire}
            removeSection={() => removeSection(index)}
            optionsTemplate={options}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={() =>
            addSection({
              id: "",
              name: "",
              description: "",
              questionnaireId: "",
              question: [],
            })
          }
        >
          Add New Section
        </Button>

        <div className="flex gap-5">
            <Button 
              type="button" 
              className="mt-5 w-full"
              disabled={isLoading}
              onClick={handleSaveClick}
            >
              Save
            </Button>

            <Button
              onClick={handleCancelClick}
              variant="destructive"
              type="button"
              className="mt-5 w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
      </form>
    </Form>

     {/* Save Dialog */}
     <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to the questionnaire?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Editing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
              No, continue editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Define types for SectionField props
interface SectionFieldProps {
  control: Control<QuestionnaireFormValues>;
  sectionIndex: number;
  sectionId: string;
  questionnaire?: Questionnaire;
  removeSection: () => void;
  optionsTemplate: OptionTemplate[];
}

const SectionField = ({
  control,
  sectionIndex,
  questionnaire,
  removeSection,
  optionsTemplate,
}: SectionFieldProps) => {
  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.question`,
  });

  

  return (
    <div className="p-5 bg-blue-100 rounded-md space-y-3">
      <div className="flex justify-between">
        <h2>Section {sectionIndex + 1}</h2>

        <Trash
          size={36}
          className="hover:bg-table-100 p-2 rounded-full"
          onClick={removeSection}
        />
      </div>

      <GenericFormField
        control={control}
        name={`sections.${sectionIndex}.name`}
        label="Section Name"
        placeholder="Enter Section Name"
      />
      <GenericFormField
        control={control}
        name={`sections.${sectionIndex}.description`}
        label="Section Description"
        placeholder="Enter Section Description"
      />

      {questions.map((question, questionIndex) => (
        <QuestionField
          key={question.id}
          control={control}
          sectionIndex={sectionIndex}
          optionId={question.optionId}
          questionIndex={questionIndex}
          optionsTemplate={optionsTemplate}
          // option={
          //   questionnaire?.sections[sectionIndex].question[questionIndex]
          //     .optionTemplate.option
          // }
          removeQuestion={() => removeQuestion(questionIndex)}
        />
      ))}

      <Button
        type="button"
        onClick={() => addQuestion({ id: "", title: "", optionId: "" })}
        variant="secondary"
        className="w-full gap-2"
      >
        <PlusCircle size={20} />
        Add New Question
      </Button>
    </div>
  );
};

// Define types for QuestionField props
interface QuestionFieldProps {
  control: Control<QuestionnaireFormValues>;
  sectionIndex: number;
  questionIndex: number;
  optionId: string;
  optionsTemplate: OptionTemplate[];
  //option?: { id: string; scaleValue: number; content?: string }[];
  removeQuestion: () => void;
}

const QuestionField = ({
  control,
  sectionIndex,
  questionIndex,
  removeQuestion,
  //option,
  optionsTemplate
}: QuestionFieldProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between">
      <span className="text-sm">Question {questionIndex + 1}</span>
      <Trash
        size={36}
        className="hover:bg-table-100 p-2 rounded-full"
        onClick={removeQuestion}
      />
    </div>
    <GenericFormField
      control={control}
      name={`sections.${sectionIndex}.question.${questionIndex}.title`}
      placeholder="Enter a new question"
      noLabel={true}
    />

    <GenericFormField
      control={control}
      name={`sections.${sectionIndex}.question.${questionIndex}.optionId`}
      type="select"
      placeholder="Select an option template"
      options={optionsTemplate.map(option => ({
        value: option.id,
        label: option.scaleType === "NUMERIC_SCALE"
          ? option.scaleType
          : option.scaleType + " - " + option.option.map(opt => opt.content).join(", ")
      }))}
      noLabel={true}
    />
    {/* <RadioGroup>
      <div className="flex flex-wrap gap-2 mt-5">
        {option?.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="flex items-center justify-center border border-black px-4 py-2 cursor-pointer space-x-2"
          >
            <RadioGroupItem
              value={option.scaleValue.toString()}
              id={`${optionIndex}-${option.scaleValue}`}
            />
            <Label htmlFor={`${optionIndex}-${option.scaleValue}`}>
              {option.content} ({option.scaleValue})
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup> */}
  </div>
);

export default EditQuestionnaireForm;
