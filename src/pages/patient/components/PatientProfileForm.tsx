import GenericFormField from "@/components/GenericFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import useLoading from "@/hooks/useLoading.hook";
import { Patient, PatientRecord } from "@/interfaces/dashboard";
import { refreshPage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"

const PatientProfileSchema = z.object({
  name: z.string().min(1),
  age: z.number(),
  gender: z.string(),
  ic: z.string(),
});

interface PatientProfileFormProps {
  patientProfile?: Patient;
}

const PatientProfileForm = ({
  patientProfile
}: PatientProfileFormProps) => {
  // TODO: check how to implement withLoading in this page
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof PatientProfileSchema>>({
    resolver: zodResolver(PatientProfileSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      ic: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof PatientProfileSchema>) => {
    try {
      const {
        name,
        age,
        gender,
        ic
      } = data;
      // update profile
      await updateProfile({
        name,
        age,
        gender,
        ic
      });

      toast({
        variant: "success",
        title: "Exercise updated!",
        description: `Profile updated successfully`,
      });

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
          name="name"
          label="Full Name"
          placeholder="Full Name"
        />
        <GenericFormField
          control={form.control}
          name="age"
          label="Age"
          placeholder="Age"
          type="number"
        />
        <GenericFormField
          control={form.control}
          name="gender"
          label="Gender"
          placeholder="Gender"
        />
        <GenericFormField
          control={form.control}
          name="ic"
          label="IC"
          placeholder="IC"
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

export default PatientProfileForm