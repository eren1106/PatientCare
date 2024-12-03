import GenericFormField from '@/components/GenericFormField'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { EXERCISE_DIFFICULTY } from '@/constants'
import { Exercise } from '@/interfaces/exercise'
import { ExerciseCategory } from '@/interfaces/exerciseCategory'
import { ExerciseSchema, ExerciseSchemaType } from '@/schemas/exercise.schema'
import { createExercise, getAllExerciseCategories, updateExercise } from '@/services/exercise.service'
import { refreshPage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';

interface ExerciseFormProps {
  exercise?: Exercise;
}

const ExerciseForm = ({ exercise }: ExerciseFormProps) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [exerciseCategories, setExerciseCategories] = useState<ExerciseCategory[]>([]);

  const form = useForm<z.infer<typeof ExerciseSchema>>({
    resolver: zodResolver(ExerciseSchema),
    defaultValues: {
      title: exercise?.title ?? "",
      description: exercise?.description ?? "",
      content: exercise?.content ?? "",
      difficulty: exercise?.difficulty ?? "EASY",
      videoUrl: exercise?.videoUrl ?? "",
      exerciseCategoryId: exercise?.exerciseCategoryId ?? "",
    }
  })

  const onSubmit = async (data: ExerciseSchemaType) => {
    try {
      if (exercise) {
        // update exercise
        await updateExercise({
          id: exercise.id,
          ...data,
        });

        toast({
          variant: "success",
          title: "Exercise updated!",
          description: `Exercise has been updated successfully`,
        });
      }
      else {
        // create exercise
        await createExercise({
          ...data,
        });

        toast({
          variant: "success",
          title: "Exercise created!",
          description: `New exercise (${data.title}) has been created successfully`,
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

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const fetchedExerciseCategories = await getAllExerciseCategories();
      setExerciseCategories(fetchedExerciseCategories);
    }
    catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `Error occured - ${e}`,
      });
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Spinner />;

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
          name="exerciseCategoryId"
          label="Exercise Category"
          placeholder="Select exercise category"
          type='select'
          options={exerciseCategories.map((category) => (
            {
              label: category.title,
              value: category.id
            }))
          }
        />
        <GenericFormField
          control={form.control}
          name="videoUrl"
          label="Video Url"
          placeholder="Copy and paste the example exercise video link at here"
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ExerciseForm