import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useParams } from "react-router-dom"
import { getQuestionnaireById } from "@/services/questionnaire.service"
import { useEffect, useState } from "react"
import useLoading from "@/hooks/useLoading.hook"
import { Questionnaire } from "@/interfaces/questionnaire"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import AutoResizeTextarea from "@/components/AutoResizeTextarea"
import Spinner from "@/components/Spinner"

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
});


const PatientQuestionnairePage = () => {
  const { id } = useParams();
  const { isLoading, withLoading } = useLoading();
  const [ questionnaire, setQuestionnaire] = useState<Questionnaire>();

  const getData = async () => {
    if (id){
      const data = await getQuestionnaireById(id);
      setQuestionnaire(data);
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "General",
      questions: [],
    },
  });

  function onSubmit() {
    console.log("Done");

  }

  return (
    <div className="flex flex-col gap-4">
      <h1>{questionnaire?.title}</h1>
      <Badge className="w-[70px]" variant="secondary">{questionnaire?.type}</Badge>
      <p className="text-sm">{questionnaire?.description}</p>
      <Card className="p-6">
      {isLoading ? (
          <Spinner />
      ) : (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <h2>Questions</h2>
          <div  className="flex flex-col gap-3 bg-pink p-5 rounded-lg">
          {questionnaire?.question.map((question, index) => (
            <div key={question.id} className="flex flex-col gap-2">
            <h3>{index + 1}.  {question.title}</h3>
            {question.fieldType.name === 'Multiple Choice' && (
              <RadioGroup className="flex flex-col gap-1 p-3">
              {question.option.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 ">
                  <RadioGroupItem value={`question-${question.id}-option-${option.id}`} id={`question-${question.id}-option-${option.id}`} />
                  <Label htmlFor={`question-${question.id}-option-${option.id}`}>{option.content}</Label>
                </div>
              ))}
            </RadioGroup>
            )}
            {question.fieldType.name === 'Text' && (
              <AutoResizeTextarea />
            )}
          </div>
          ))}
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
              type="submit"
              disabled={isLoading}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>)}
      </Card>
    </div>
  )
}

export default PatientQuestionnairePage
