import DialogButton from "@/components/DialogButton"
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading.hook";
import Combobox from "@/components/Combobox";
import { useEffect, useState } from "react";
import { Exercise, PatientExercise } from "@/interfaces/exercise";
import { createPatientExercise, deletePatientExerciseById, getPatientExercisesByPatientId, updatePatientExercise } from "@/services/patientExercise.service";
import PatientExercisesTable from "../../dashboard/components/PatientExercisesTable";
import { useToast } from "@/components/ui/use-toast";
import { getExercises } from "@/services/exercise.service";
import { refreshPage } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PatientExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.coerce.number().nonnegative(),
  // sets: z.preprocess((a) => parseInt(z.string().parse(a), 10),
  //   z.number().gte(1, 'Must be 1 and above')),
});

const PatientRecordExerciseTabContent = ({patientId}: {patientId: string}) => {
  // const { recordId } = useParams(); // id = patient's ID
  const { isLoading, withLoading } = useLoading();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [patientExercises, setPatientExercises] = useState<PatientExercise[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedEditPatientExercise, setSelectedEditPatientExercise] = useState<PatientExercise | null>(null);

  const getData = async () => {
    if (patientId) {
      const patientExercisesData = await getPatientExercisesByPatientId(patientId);
      setPatientExercises(patientExercisesData);
    }

    const exercisesData = await getExercises();
    setExercises(exercisesData);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const form = useForm<z.infer<typeof PatientExerciseSchema>>({
    resolver: zodResolver(PatientExerciseSchema),
    defaultValues: {
      sets: 1,
    }
  });

  const onSubmit = async (data: z.infer<typeof PatientExerciseSchema>) => {
    if (!patientId) return;
    const {
      exerciseId,
      sets,
    } = data;

    console.log("PATIENT ID: ", patientId)
    try {
      if (showEditModal) {
        // edit patient exercise
        await updatePatientExercise({
          patientId,
          exerciseId,
          sets,
          patientExerciseId: selectedEditPatientExercise?.id,
        });

        toast({
          variant: "success",
          title: "Exercise Updated Successfully",
        });
      }
      else {
        // create patient exercise
        await createPatientExercise({
          patientId,
          exerciseId,
          sets,
        });

        toast({
          variant: "success",
          title: "Exercise Assigned Successfully",
        });
      }

      refreshPage();
    }
    catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e.response.data.message}`,
      });
    }
  };

  const handleSelectExercise = (id: string) => {
    form.setValue("exerciseId", id);
  }

  const handleClickDelete = async (id: string) => {
    try {
      await deletePatientExerciseById(id);

      toast({
        variant: "success",
        title: "Unassigned Exercise Successfully",
      });

      refreshPage();
    }
    catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e}`,
      });
    }
  }

  const handleClickEdit = (patientExercise: PatientExercise) => {
    setSelectedEditPatientExercise(patientExercise);
    form.reset({
      exerciseId: patientExercise.exercise.id,
      sets: patientExercise.sets,
    });
    setShowEditModal(true);
  }

  const handleChangeEditModal = (open: boolean) => {
    setShowEditModal(open);
    if (open) form.reset();
  }

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2>Assigned Exercises</h2>

        {/* CREATE PATIENT EXERCISE */}
        <DialogButton
          variant="default"
          title="Assign Exercise"
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
                            items={exercises.map((exercise) => ({
                              label: exercise.title,
                              value: exercise.id,
                            }))}
                            onSelect={handleSelectExercise}
                            placeholder="Select Exercise..."
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
          }>Assign Exercise</DialogButton>
      </div>
      <PatientExercisesTable
        patientExercises={patientExercises}
        onDelete={handleClickDelete}
        onEdit={handleClickEdit}
      />

      {/* TODO: MAKE CREATE & EDIT THE SAME COMPONENT */}
      {/* EDIT PATIENT EXERCISE MODAL */}
      <Dialog open={showEditModal} onOpenChange={handleChangeEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Assigned Exercise</DialogTitle>
          </DialogHeader>
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
                        items={exercises.map((exercise) => ({
                          label: exercise.title,
                          value: exercise.id,
                        }))}
                        onSelect={handleSelectExercise}
                        placeholder="Select Exercise..."
                        initialValue={form.getValues("exerciseId")}
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PatientRecordExerciseTabContent