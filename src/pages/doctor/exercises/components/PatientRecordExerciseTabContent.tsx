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
import PatientExerciseForm from "../../dashboard/components/PatientExerciseForm";
import Spinner from "@/components/Spinner";

const PatientExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.coerce.number().nonnegative(),
});

const PatientRecordExerciseTabContent = ({ patientId }: { patientId: string }) => {
  // const { recordId } = useParams(); // id = patient's ID
  const { isLoading, withLoading } = useLoading();
  const { toast } = useToast();
  const [patientExercises, setPatientExercises] = useState<PatientExercise[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedEditPatientExercise, setSelectedEditPatientExercise] = useState<PatientExercise | null>(null);

  const getData = async () => {
    if (patientId) {
      const patientExercisesData = await getPatientExercisesByPatientId(patientId);
      setPatientExercises(patientExercisesData);
    }

    // const exercisesData = await getExercises();
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
    // form.reset({
    //   exerciseId: patientExercise.exercise.id,
    //   sets: patientExercise.sets,
    // });
    setShowEditModal(true);
  }

  const handleChangeEditModal = (open: boolean) => {
    setShowEditModal(open);
    if (open) form.reset();
  }

  if (isLoading) return <Spinner />
  return (
    <div className="mt-5">
      <div className="flex justify-between items-center px-2">
        <span className="text-md sm:text-lg font-semibold ">Assigned Exercises</span>


        {/* CREATE PATIENT EXERCISE */}
        <DialogButton
          variant="default"
          title="Assign Exercise"
          content={
            <PatientExerciseForm patientId={patientId} />
          }>Assign Exercise</DialogButton>
      </div>
      <PatientExercisesTable
        patientExercises={patientExercises}
        onDelete={handleClickDelete}
        onEdit={handleClickEdit}
      />

      {/* EDIT PATIENT EXERCISE MODAL */}
      <Dialog open={showEditModal} onOpenChange={handleChangeEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Assigned Exercise</DialogTitle>
          </DialogHeader>
          {
            selectedEditPatientExercise && (
              <PatientExerciseForm
                patientId={patientId}
                patientExerciseId={selectedEditPatientExercise.id}
                defaultValues={{
                  exerciseId: selectedEditPatientExercise.exercise.id,
                  sets: selectedEditPatientExercise.sets,
                  reps: selectedEditPatientExercise.reps,
                  frequency: selectedEditPatientExercise.frequency,
                  duration: selectedEditPatientExercise.duration,
                }}
              />
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PatientRecordExerciseTabContent