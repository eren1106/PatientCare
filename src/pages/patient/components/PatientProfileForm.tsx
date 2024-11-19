import FormButton from "@/components/FormButton";
import GenericFormField from "@/components/GenericFormField";
import ProfilePictureUploader from "@/components/ProfilePictureUploader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import { GENDER_SELECT, MAX_IMAGE_SIZE } from "@/constants";
import useLoading from "@/hooks/useLoading.hook";
import { Patient } from "@/interfaces/user";
import { updateProfile } from "@/services/profile.service";
import { refreshPage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"

const PatientProfileSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'Invalid file type'
    )
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      `File size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    )
    .optional(),
  fullname: z.string().min(1),
  age: z.coerce.number(),
  gender: z.string(),
  ic: z.string(),
});

interface PatientProfileFormProps {
  profile: Patient;
}

const PatientProfileForm = ({
  profile
}: PatientProfileFormProps) => {
  // TODO: check how to implement withLoading in this page
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof PatientProfileSchema>>({
    resolver: zodResolver(PatientProfileSchema),
    defaultValues: {
      fullname: profile.fullname,
      age: profile.age,
      gender: profile.gender,
      ic: profile.ic,
    }
  });

  const onSubmit = async (data: z.infer<typeof PatientProfileSchema>) => {
    try {
      const formData = new FormData();

      const { image, ...dataWithoutImage } = data;
      formData.append("json", JSON.stringify(dataWithoutImage));
      if (image) formData.append("imageFile", image);

      // update profile
      await updateProfile({
        id: profile.id,
        formData,
      });

      toast({
        variant: "success",
        title: "Profile updated!",
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
          type="custom"
          name="image"
          control={form.control}
          description="Image max size: 5mb"
          customChildren={
            <ProfilePictureUploader
              onChange={(file) => form.setValue("image", file)}
              defaultImageUrl={profile.profileImageUrl ?? undefined}
            />
          }
        />
        <GenericFormField
          control={form.control}
          name="fullname"
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
          type="select"
          options={GENDER_SELECT}
        />
        <GenericFormField
          control={form.control}
          name="ic"
          label="IC"
          placeholder="IC"
        />

        <FormButton
          disabled={isLoading}
        >
          Submit
        </FormButton>
      </form>
    </Form>
  )
}

export default PatientProfileForm