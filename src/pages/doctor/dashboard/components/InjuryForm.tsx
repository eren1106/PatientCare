import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GenericFormField from "@/components/GenericFormField";
import { Injury, updateInjury, createInjury } from "@/services/dashboard.service";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";

// Define the form schema with Zod
const formSchema = z.object({
  painRegion: z.string().min(1, "Pain Region is required"),
  painScore: z.coerce
    .number()
    .min(1, "Pain Score must be between 1 and 10")
    .max(10, "Pain Score must be between 1 and 10"),
  duration: z.string().min(1, "Duration is required"),
  is_recurrent: z.enum(["YES", "NO"]),
  description: z.string(),
});

type InjuryFormValues = z.infer<typeof formSchema>;

interface UpdateInjuryFormProps {
  open: boolean;
  onClose: () => void;
  injury: Injury | null;
  onUpdate: () => void;
  isCreateMode?: boolean;
  patientRecordId? : string;
}

const InjuryForm: React.FC<UpdateInjuryFormProps> = ({
  open,
  onClose,
  injury,
  onUpdate,
  isCreateMode = false,
  patientRecordId
}) => {
  const form = useForm<InjuryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      painRegion: injury?.painRegion || '',
      painScore: injury?.painScore || 0,
      duration: injury?.duration || '',
      is_recurrent: injury?.is_recurrent || 'NO',
      description: injury?.description || '',
    },
  });

  const { reset } = form;

    // Reset form values when injury changes or when switching to create mode
    useEffect(() => {
      if (injury) {
        reset({
          painRegion: injury.painRegion || '',
          painScore: injury.painScore || 0,
          duration: injury.duration || '',
          is_recurrent: injury.is_recurrent || 'NO',
          description: injury.description || '',
        });
      } else {
        reset({
          painRegion: '',
          painScore: 0,
          duration: '',
          is_recurrent: 'NO',
          description: '',
        });
      }
    }, [injury, reset]);


  const onSubmit = async (values: InjuryFormValues) => {
    try {
      if (isCreateMode && patientRecordId) {
        // Call the create API
        await createInjury({...values, patientRecordId});
        toast({
          variant: "success",
          title: "Injury Created Successfully",
          description: `A new injury record has been created for ${values.painRegion}.`,
        });

        form.reset({
          painRegion: "",
          painScore: 0,
          duration: "",
          is_recurrent: "NO",
          description: "",
        });
      } else {
        // Call the update API
        await updateInjury(injury?.id!, values);
        toast({
          variant: "success",
          title: "Injury Updated Successfully",
          description: `The injury record for ${values.painRegion} has been updated.`,
        });
      }

      onClose();
      onUpdate();  
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isCreateMode ? "Injury Creation Failed" : "Injury Update Failed",
        description: `Error: ${error.message}.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{isCreateMode ? "Create Injury" : "Update Injury"}</DialogTitle>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <GenericFormField
            control={form.control}
            name="painRegion"
            label="Pain Region"
            type="input"
            placeholder="Enter pain region"
          />

          <GenericFormField
            control={form.control}
            name="painScore"
            label="NRS Pain Score"
            type="number"
            placeholder="Enter pain score"
          />

          <GenericFormField
            control={form.control}
            name="duration"
            label="Duration"
            type="input"
            placeholder="Enter duration"
          />

          <GenericFormField
            control={form.control}
            name="is_recurrent"
            label="Recurrent?"
            type="select"
            options={[
              { value: "YES", label: "Yes" },
              { value: "NO", label: "No" },
            ]}
            placeholder="Select an option"
          />

          <GenericFormField
            control={form.control}
            name="description"
            label="Injury Description"
            type="textarea"
            placeholder="Describe the injury"
          />

          <Button type="submit">{isCreateMode ? "Create Injury" : "Save Changes"}</Button>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InjuryForm;
