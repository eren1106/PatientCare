import GenericFormField from '@/components/GenericFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { EXERCISE_DIFFICULTY } from '@/constants'
import useLoading from '@/hooks/useLoading.hook'
import { Exercise } from '@/interfaces/exercise'
import { createExercise, updateExercise } from '@/services/exercise.service'
import { refreshPage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod';

const ExerciseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string(),
  difficulty: z.string(),
  videoUrl: z.string().min(1),
});

interface ExerciseFormProps {
  exercise?: Exercise;
}

const ExerciseForm = ({ exercise }: ExerciseFormProps) => {
  const { toast } = useToast();

  // TODO: check how to implement withLoading in this page
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof ExerciseSchema>>({
    resolver: zodResolver(ExerciseSchema),
    defaultValues: {
      title: exercise?.title ?? "",
      description: exercise?.description ?? "",
      content: exercise?.content ?? "",
      difficulty: exercise?.difficulty ?? "EASY",
      videoUrl: exercise?.videoUrl ?? "",
    }
  })

  const onSubmit = async (data: z.infer<typeof ExerciseSchema>) => {
    try {
      const {
        title,
        description,
        content,
        difficulty,
        videoUrl
      } = data;
      if (exercise) {
        // update exercise
        await updateExercise({
          id: exercise.id,
          title,
          description,
          content,
          difficulty,
          videoUrl
        });

        toast({
          variant: "success",
          title: "Exercise updated!",
          description: `Exercise (${title}) has been updated successfully`,
        });
      }
      else {
        // create exercise
        await createExercise({
          title,
          description,
          content,
          difficulty,
          videoUrl
        });

        toast({
          variant: "success",
          title: "Exercise created!",
          description: `New exercise (${title}) has been created successfully`,
        });

        form.reset();
      }

      refreshPage();
    }
    catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `Error occured - ${e}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <GenericFormField
          control={form.control}
          name="title"
          label="Title"
          placeholder="Exercise Title"
        />
        <GenericFormField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Description"
        />
        <GenericFormField
          control={form.control}
          name="content"
          label="Content"
          placeholder="Explain the exercise in details (steps, equipments required, duration and etc."
          type='textarea'
        />
        <GenericFormField
          control={form.control}
          name="difficulty"
          label="Difficulty"
          placeholder="Select difficulty of exercise"
          type='select'
          options={EXERCISE_DIFFICULTY}
        />
        <GenericFormField
          control={form.control}
          name="videoUrl"
          label="Video Url"
          placeholder="Copy and paste the example exercise video link at here"
        />

        <Button
          type="submit"
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ExerciseForm