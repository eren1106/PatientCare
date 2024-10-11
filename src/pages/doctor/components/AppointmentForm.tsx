'use client'

import FormButton from "@/components/FormButton";
import GenericFormField from "@/components/GenericFormField";
import { toast } from "@/components/ui/use-toast";
import ZodForm from "@/components/ZodForm";
import { useZodForm } from "@/hooks/useZodForm.hook";
import { User } from "@/interfaces/user";
import { AppointmentSchema, AppointmentSchemaType } from "@/schemas/appointment.schema";
import { createAppointment, updateAppointment } from "@/services/appointment.service";
import { getCurrentUser } from "@/services/auth.service";
import { getAllPatientsByDoctorId } from "@/services/user.service";
import { refreshPage } from "@/utils";
import { useEffect, useState } from "react";

interface AppointmentFormProps {
  appointmentId?: string;
  defaultValues?: AppointmentSchemaType;
}

const AppointmentForm = ({ appointmentId, defaultValues }: AppointmentFormProps) => {
  const userData = getCurrentUser();

  const [patients, setPatients] = useState<User[]>([]);
  const getData = async () => {
    if(!userData?.id) return;
    const data = await getAllPatientsByDoctorId(userData.id);
    setPatients(data);
  }
  useEffect(() => {
    getData();
  }, [])

  const form = useZodForm(AppointmentSchema, defaultValues ?? {
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + (60 * 60 * 1000)), // default endTime is 1 hour after the startTime
  });

  const onSubmit = async (data: AppointmentSchemaType) => {
    console.log("DATA", data);

    try {
      if(appointmentId) {
        // UPDATE
        await updateAppointment({
          ...data,
          id: appointmentId
        })
      }
      else {
        // CREATE
        if(!userData) return;
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
      <FormButton type="submit" className="w-min ml-auto" disabled={!form.formState.isDirty}>
        Save
      </FormButton>
    </ZodForm>
  )
}

export default AppointmentForm