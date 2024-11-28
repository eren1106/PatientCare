'use client'

import DynamicDialogTrigger from "@/components/DynamicDialogTrigger";
import FormButton from "@/components/FormButton";
import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ZodForm from "@/components/ZodForm";
import { useZodForm } from "@/hooks/useZodForm.hook";
import { User } from "@/interfaces/user";
import { createPatientExercise, deletePatientExerciseById, updatePatientExercise } from "@/services/patientExercise.service";
import { getCurrentUser } from "@/services/auth.service";
import { getAllPatientsByDoctorId } from "@/services/user.service";
import { refreshPage } from "@/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PatientExerciseSchema, PatientExerciseSchemaType } from "@/schemas/patientExercise.schema";
import { Exercise } from "@/interfaces/exercise";
import { getExercises } from "@/services/exercise.service";

interface PatientExerciseFormProps {
  patientId: string;
  patientExerciseId?: string;
  defaultValues?: PatientExerciseSchemaType;
}

const PatientExerciseForm = ({ patientId, patientExerciseId, defaultValues }: PatientExerciseFormProps) => {
  const userData = getCurrentUser();

  const [exercises, setExercises] = useState<Exercise[]>([]);

  const getData = async () => {
    const exercisesData = await getExercises();
    setExercises(exercisesData);
  }
  useEffect(() => {
    getData();
  }, [])

  const form = useZodForm(PatientExerciseSchema, defaultValues ?? {
    sets: 1,
  });

  const onSubmit = async (data: PatientExerciseSchemaType) => {
    if (!patientId) return;

    console.log("PATIENT ID: ", patientId)
    try {
      if (patientExerciseId) {
        // edit patient exercise
        await updatePatientExercise({
          ...data,
          patientId,
          patientExerciseId,
        });

        toast({
          variant: "success",
          title: "Exercise Updated Successfully",
        });
      }
      else {
        // create patient exercise
        await createPatientExercise({
          ...data,
          patientId,
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

  return (
    <ZodForm form={form} onSubmit={onSubmit}>
      <GenericFormField
        control={form.control}
        name="exerciseId"
        label="Exercise"
        type="combobox"
        placeholder="Select Exercise..."
        options={
          exercises.map((exercise) => ({
            label: exercise.title,
            value: exercise.id,
          }))
        }
      />
      <GenericFormField
        control={form.control}
        name="reps"
        label="Reps"
        type="number"
        placeholder="Set how many reps"
      />
      <GenericFormField
        control={form.control}
        name="sets"
        label="Sets"
        type="number"
        placeholder="Set how many sets"
      />
      <GenericFormField
        control={form.control}
        name="frequency"
        label="Frequency per week"
        type="number"
        placeholder="Set frequency per week"
      />
      <GenericFormField
        control={form.control}
        name="duration"
        label="Duration"
        type="number"
        placeholder="Set duration"
      />
      <FormButton
        type="submit"
        className="w-min ml-auto"
        disabled={!form.formState.isDirty || form.formState.isSubmitting}
        isLoading={form.formState.isSubmitting}
      >
        Save
      </FormButton>
    </ZodForm>
  )
}

export default PatientExerciseForm