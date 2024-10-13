'use client'

import DynamicDialogTrigger from "@/components/DynamicDialogTrigger";
import FormButton from "@/components/FormButton";
import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ZodForm from "@/components/ZodForm";
import { useZodForm } from "@/hooks/useZodForm.hook";
import { User } from "@/interfaces/user";
import { AppointmentSchema, AppointmentSchemaType } from "@/schemas/appointment.schema";
import { createAppointment, deleteAppointmentById, updateAppointment } from "@/services/appointment.service";
import { getCurrentUser } from "@/services/auth.service";
import { getAllPatientsByDoctorId } from "@/services/user.service";
import { refreshPage } from "@/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AppointmentFormProps {
  appointmentId?: string;
  defaultValues?: AppointmentSchemaType;
  selectedDate?: Date;
}

const AppointmentForm = ({ appointmentId, defaultValues, selectedDate }: AppointmentFormProps) => {
  const userData = getCurrentUser();

  const [patients, setPatients] = useState<User[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const getData = async () => {
    if (!userData?.id) return;
    const data = await getAllPatientsByDoctorId(userData.id);
    setPatients(data);
  }
  useEffect(() => {
    getData();
  }, [])

  const form = useZodForm(AppointmentSchema, defaultValues ?? {
    date: selectedDate ?? new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + (60 * 60 * 1000)), // default endTime is 1 hour after the startTime
  });

  const onSubmit = async (data: AppointmentSchemaType) => {
    console.log("DATA", data);

    try {
      if (appointmentId) {
        // UPDATE
        await updateAppointment({
          ...data,
          id: appointmentId
        })
      }
      else {
        // CREATE
        if (!userData) return;
        await createAppointment({
          ...data,
          doctorId: userData?.id
        });
      }

      toast({
        title: `Appointment ${appointmentId ? "updated" : "created"} successfully`,
      });

      refreshPage();
    }
    catch (e) {
      toast({
        title: "Failed to create appointment",
        description: `${e}`,
        variant: "destructive"
      })
    }
  };

  const handleClickDelete = () => {
    setShowDelete(true);
  }

  const handleClickConfirmDelete = async () => {
    if (!appointmentId) return;
    try {
      await deleteAppointmentById(appointmentId);
      toast({
        variant: "success",
        title: "Appointment Deleted Successfully",
      });
    }
    catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e}`,
      });
    }

    setShowDelete(false);

    refreshPage();
  }

  return (
    <ZodForm form={form} onSubmit={onSubmit}>
      <GenericFormField
        name="title"
        control={form.control}
      />
      <GenericFormField
        name="description"
        type="textarea"
        control={form.control}
      />
      <GenericFormField
        name="date"
        type="date"
        control={form.control}
      />
      <GenericFormField
        name="startTime"
        type="time"
        control={form.control}
      />
      <GenericFormField
        name="endTime"
        type="time"
        control={form.control}
      />
      <GenericFormField
        name="patientId"
        type="select"
        label="Patient"
        placeholder="Select a patient"
        options={patients.map((patient) => ({
          label: patient.fullname,
          value: patient.id
        }))}
        control={form.control}
      />
      <div className="flex items-center justify-between">
        {
          appointmentId && (
            <Button
              variant="destructive"
              onClick={handleClickDelete}
              className="flex items-center gap-2"
            >
              <Trash2 />
              Delete
            </Button>
          )
        }
        <FormButton
          type="submit"
          className="w-min ml-auto"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
        >
          Save
        </FormButton>
      </div>

      <DynamicDialogTrigger
        title="Delete Appointment Confirmation"
        open={showDelete}
        onOpenChange={setShowDelete}
        content={
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to delete this appointment?</p>
            <Button variant="destructive" onClick={handleClickConfirmDelete}>Confirm</Button>
          </div>
        }
      />
    </ZodForm>
  )
}

export default AppointmentForm