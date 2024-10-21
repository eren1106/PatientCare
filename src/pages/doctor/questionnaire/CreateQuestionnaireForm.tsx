import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import GenericFormField from "@/components/GenericFormField";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import useLoading from "@/hooks/useLoading.hook";
import { useNavigate } from "react-router-dom";
import { Plus, Trash } from "lucide-react";
import { insertQuestionnaire } from "@/services/questionnaire.service";

const GradeSchema = z.object({
  gradeName: z.string().min(1, "Grade name is required"),
  minMarks: z.string(),
  maxMarks: z.string(),
});


const OptionSchema = z.object({
  content: z.string().min(1, "Option content is required"),
});

const QuestionSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  type: z.enum(["Multiple Choice", "Text"]),
  options: z.array(OptionSchema).optional(),
});

const QuestionnaireSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Title is required"),
  type: z.enum(["General", "Shoulder", "Knee"]),
  questions: z.array(QuestionSchema),
  grades: z.array(GradeSchema),
});

const CreateQuestionnaireForm = () => {
  const { toast } = useToast();
  const { isLoading, withLoading } = useLoading();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "General",
      questions: [],
    },
  });

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const { fields: grades, append: addGrade, remove: removeGrade } = useFieldArray({
    control: form.control,
    name: "grades",
  });

  const onSubmit = async (data: z.infer<typeof QuestionnaireSchema>) => {
    try {
      const createQuestionnaire = await insertQuestionnaire(data);
      withLoading(createQuestionnaire);
      toast({
        variant: "success",
        title: "Questionnaire created!",
        description: `New questionnaire (${data.title}) has been created successfully`,
      });
      form.reset();
      navigate("/dashboard/questionnaire");
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: `Error occurred: ${e.message}`,
      });
    }
  };

  const handleCancelClick = () => {
    navigate("/dashboard/questionnaire");
  };
  return (
    <section className="flex flex-col gap-3 ">
      <div>
        <h1>Create Questionnaire</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <h2>Questionnaire</h2>
          <div className="flex flex-col gap-3 bg-secondary p-5 rounded-lg">
            <GenericFormField
              control={form.control}
              name="title"
              label="Title"
              placeholder="Questionnaire Title"
            />
            <GenericFormField
              control={form.control}
              name="description"
              label="Description"
              type="textarea"
              placeholder="Description"
            />
            <GenericFormField
              control={form.control}
              name="type"
              label="Type"
              type="select"
              options={[
                { label: "General", value: "General" },
                { label: "Shoulder", value: "Shoulder" },
                { label: "Knee", value: "Knee" },
              ]}
            />
          </div>

          <h2>Questions</h2>
          <div className="flex flex-col gap-3 bg-pink p-5 rounded-lg">
            {questions.map((question, qIndex) => (
              <div key={question.id} className="question-block">
                <div className="flex items-center justify-between">
                  <h3>Question {qIndex + 1}</h3>
                  <Trash
                    size={36}
                    className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                    onClick={() => removeQuestion(qIndex)}
                  />
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <GenericFormField
                    control={form.control}
                    name={`questions.${qIndex}.title`}
                    label="Question Title"
                    placeholder="Enter question title"
                  />
                  <GenericFormField
                    control={form.control}
                    name={`questions.${qIndex}.type`}
                    label="Question Type"
                    type="select"
                    options={[
                      { label: "Multiple Choice", value: "Multiple Choice" },
                      { label: "Text", value: "Text" },
                    ]}
                  />
                  {/* TODO : Dynamic marks allocation */}
                  <GenericFormField
                    control={form.control}
                    name="Marks"
                    label="Question Marks"
                    type="number"
                  />
                </div>

                {form.watch(`questions.${qIndex}.type`) ===
                  "Multiple Choice" && (
                  <div>
                    <Controller
                      control={form.control}
                      name={`questions.${qIndex}.options` as const}
                      defaultValue={[]}
                      render={({ field: { value = [], onChange } }) => (
                        <>
                          {value.map(
                            (_option: { content: string }, optIndex: number) => (
                              <div
                                key={optIndex}
                                className="flex items-center space-x-2 p-3"
                              >
                                <p className="text-sm">{`Option ${
                                  optIndex + 1
                                }`}</p>
                                <GenericFormField
                                  name={
                                    `questions.${qIndex}.options.${optIndex}.content` as const
                                  }
                                  label=""
                                  control={form.control}
                                  placeholder="Option content"
                                  type="input"
                                />
                                <Trash
                                  size={36}
                                  className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                                  onClick={() => {
                                    const newOptions = value.filter(
                                      (_, i) => i !== optIndex
                                    );
                                    onChange(newOptions);
                                  }}
                                />
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            onClick={() =>
                              onChange([...value, { content: "" }])
                            }
                            variant="secondary"
                            className="mt-3"
                          >
                            <Plus size={16} />
                            Add Option
                          </Button>
                        </>
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            onClick={() =>
              addQuestion({ title: "", type: "Text", options: [] })
            }
            variant="outline"
          >
            Add Question
          </Button>
          
          {/* TODO : Dynamic marks allocation */}
          <h2>Questionnaire Grades</h2>
          <div className="flex flex-col gap-3 bg-light p-5 rounded-lg">
  {grades.map((grade, gIndex) => (
    <div key={grade.id} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3>Grade {gIndex + 1}</h3>
        <Trash
          size={36}
          className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
          onClick={() => removeGrade(gIndex)}
        />
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <GenericFormField
          control={form.control}
          name={`grades.${gIndex}.gradeName`}
          label="Grade Name"
          placeholder="Enter grade name"
        />
        <div className="flex items-center gap-2">
          <GenericFormField
            control={form.control}
            name={`grades.${gIndex}.minMarks`}
            label="Min Marks"
            placeholder="Min marks"
            type="number"
          />
          <span>-</span>
          <GenericFormField
            control={form.control}
            name={`grades.${gIndex}.maxMarks`}
            label="Max Marks"
            placeholder="Max marks"
            type="number"
          />
        </div>
      </div>
    </div>
  ))}
  <Button
    type="button"
    onClick={() => addGrade({ gradeName: "", minMarks: '0', maxMarks: '0' })}
    variant="secondary"
    className="mt-3"
  >
    <Plus size={16} />
    Add Grade
  </Button>
</div>
          <div className="flex items-center justify-center gap-2 mt-5">
            <Button
              className="w-1/4"
              type="submit"
              disabled={isLoading}
              variant="secondary"
            >
              Submit
            </Button>
            <Button
              className="w-1/4"
              onClick={handleCancelClick}
              disabled={isLoading}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateQuestionnaireForm;
