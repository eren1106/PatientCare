import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import GenericFormField from "@/components/GenericFormField";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import useLoading from "@/hooks/useLoading.hook";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash } from "lucide-react";
import { insertQuestionnaire, getOptions } from "@/services/questionnaire.service";
import { useEffect, useState } from "react";
import { OptionTemplate } from "@/interfaces/questionnaire";
import { getCurrentUser } from "@/services/auth.service";

const questionnaireSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["General", "Knee", "Shoulder"]),
  index: z.string(),
  sections: z.array(
    z.object({
      name: z.string().min(1, "Section name is required"),
      description: z.string().min(1, "Section description is required"),
      questions: z.array(
        z.object({
          title: z.string().min(1, "Question title is required"),
          optionId: z.string().min(1, "Option ID is required"),
        })
      ),
    })
  ),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

const CreateQuestionnaireForm = () => {
  const { toast } = useToast();
  //const { isLoading, withLoading } = useLoading();
  const navigate = useNavigate();

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      title: "",
      description: "",
      index: "",
      type: "General",
      sections: [],
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

  const {
    fields: sections,
    append: addSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const onSubmit = async (data: QuestionnaireFormValues) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return;
      }
      const payload = {
        authorId: currentUser.id,
        ...data,
      };
      await insertQuestionnaire(payload);
      toast({
        title: "Creation Success",
        variant: "success",
        description: `Successfully created the questionnaire`,
      });
      navigate("/dashboard/questionnaire");
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        variant: "destructive",
        description: `Failed to create the questionnaire`,
      });
      navigate("/dashboard/questionnaire");
    }
  };

  return (
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

          <GenericFormField
            control={form.control}
            name="index"
            label="Index"
            placeholder="Enter questionnaire index"
          />
          <GenericFormField
            control={form.control}
            name="type"
            label="Type"
            type="select"
            options={[
              { value: "General", label: "General" },
              { value: "Shoulder", label: "Shoulder" },
              { value: "Knee", label: "Knee" },
            ]}
            placeholder="Select questionnaire type"
          />
        </div>

        {sections.map((section, index) => (
          <SectionField
            key={section.id}
            control={form.control}
            sectionIndex={index}
            sectionId={section.id}
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
              name: "",
              description: "",
              questions: [],
            })
          }
        >
          <PlusCircle size={20} />
          Add New Section
        </Button>

        <Button type="submit" className="mt-5 w-full">
          Create Questionnaire
        </Button>
      </form>
    </Form>
  );
};

// Define types for SectionField props
interface SectionFieldProps {
  control: Control<QuestionnaireFormValues>;
  sectionIndex: number;
  sectionId: string;
  removeSection: () => void;
  optionsTemplate: OptionTemplate[];
}

const SectionField = ({
  control,
  sectionIndex,
  removeSection,
  optionsTemplate,
}: SectionFieldProps) => {
  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
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
          questionIndex={questionIndex}
          optionsTemplate={optionsTemplate}
          removeQuestion={() => removeQuestion(questionIndex)}
        />
      ))}

      <Button
        type="button"
        onClick={() => addQuestion({ title: "", optionId: "" })}
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
  optionsTemplate: OptionTemplate[];
  removeQuestion: () => void;
}

const QuestionField = ({
  control,
  sectionIndex,
  questionIndex,
  removeQuestion,
  optionsTemplate,
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
      name={`sections.${sectionIndex}.questions.${questionIndex}.title`}
      placeholder="Enter a new question"
      noLabel={true}
    />

    <GenericFormField
      control={control}
      name={`sections.${sectionIndex}.questions.${questionIndex}.optionId`}
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
  </div>
);

export default CreateQuestionnaireForm;