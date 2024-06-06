'use client'

import GenericFormField from '@/components/GenericFormField'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { EXERCISE_DIFFICULTY } from '@/constants'
import useLoading from '@/hooks/useLoading.hook'
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

const ExerciseForm = () => {
  const { toast } = useToast();
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof ExerciseSchema>>({
    resolver: zodResolver(ExerciseSchema),
    // defaultValues: {
    // }
  })

  const onSubmit = async (data: z.infer<typeof ExerciseSchema>) => {
    try {

    }
    catch (e) {

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