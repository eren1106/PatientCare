'use client'

import FormButton from "@/components/FormButton";
import GenericFormField from "@/components/GenericFormField";
import ZodForm from "@/components/ZodForm";
import { useZodForm } from "@/hooks/useZodForm.hook";
import { AppointmentSchema, AppointmentSchemaType } from "@/schemas/appointment.schema";

interface AppointmentFormProps {
  defaultValues?: AppointmentSchemaType;
}

const AppointmentForm = ({ defaultValues }: AppointmentFormProps) => {
  const form = useZodForm(AppointmentSchema, defaultValues ?? {});

  const onSubmit = async (data: AppointmentSchemaType) => {
    console.log("DATA", data);

    try {

    }
    catch (e) {

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
        options={[
          // TODO: replace with real data
          {
            value: "123",
            label: "Ali"
          },
          {
            value: "456",
            label: "Abu"
          }
        ]}
        control={form.control}
      />
      <FormButton type="submit" className="w-min ml-auto" disabled={!form.formState.isDirty}>
        Save
      </FormButton>
    </ZodForm>
  )
}

export default AppointmentForm