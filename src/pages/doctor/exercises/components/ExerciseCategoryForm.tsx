import GenericFormField from '@/components/GenericFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { ExerciseCategory } from '@/interfaces/exerciseCategory'
import { ExerciseCategorySchema, ExerciseCategorySchemaType } from '@/schemas/exerciseCategory.schema'
import { createExerciseCategory, getAllExerciseCategories, updateExerciseCategory } from '@/services/exercise.service'
import { refreshPage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ExerciseFormProps {
  exerciseCategory?: ExerciseCategory;
}

const ExerciseCategoryForm = ({ exerciseCategory }: ExerciseFormProps) => {
  const { toast } = useToast();

  const form = useForm<ExerciseCategorySchemaType>({
    resolver: zodResolver(ExerciseCategorySchema),
    defaultValues: {
      title: exerciseCategory?.title ?? "",
      description: exerciseCategory?.description ?? "",
    }
  })

  const onSubmit = async (data: ExerciseCategorySchemaType) => {
    try {
      if (exerciseCategory) {
        // update exerciseCategory
        await updateExerciseCategory({
          id: exerciseCategory.id,
          ...data,
        });

        toast({
          variant: "success",
          title: "Exercise Category updated!",
          description: `Exercise Category has been updated successfully`,
        });
      }
      else {
        // create exerciseCategory
        await createExerciseCategory({
          ...data,
        });

        toast({
          variant: "success",
          title: "Exercise Category created!",
          description: `New Exercise Category (${data.title}) has been created successfully`,
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
          placeholder="Exercise Category Title"
        />
        <GenericFormField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Description"
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ExerciseCategoryForm