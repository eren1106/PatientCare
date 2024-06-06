import { MOCK_EXERCISES } from "@/constants"
import ExercisesTable from "./ExercisesTable"
import DialogButton from "@/components/DialogButton"
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading.hook";
import Combobox from "@/components/Combobox";

const PatientExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.number().min(0),
});

const PatientRecordExerciseTabContent = () => {
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof PatientExerciseSchema>>({
    resolver: zodResolver(PatientExerciseSchema),
    defaultValues: {
      sets: 1,
    }
  });

  const onSubmit = async (data: z.infer<typeof PatientExerciseSchema>) => {
    try {

    }
    catch (e) {

    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2>Assigned Exercises</h2>
        <DialogButton
          variant="default"
          title="Add Exercise"
          content={
            <div className="flex flex-col gap-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                  <FormField
                    control={form.control}
                    name="exerciseId"
                    render={() => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Exercise</FormLabel>
                        <FormControl>
                          <Combobox
                            items={MOCK_EXERCISES.map((exercise) => ({
                              label: exercise.title,
                              value: exercise.id,
                            }))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <GenericFormField
                    control={form.control}
                    name="sets"
                    label="Sets"
                    type="number"
                    placeholder="Set how many set per day"
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          }>Add Exercise</DialogButton>
      </div>
      <ExercisesTable exercises={MOCK_EXERCISES} />
    </div>
  )
}

export default PatientRecordExerciseTabContent