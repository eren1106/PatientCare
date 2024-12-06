import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  PatientRecord,
} from "@/interfaces/dashboard";
import { Pencil } from "lucide-react";
import { updatePatientRecord } from "@/services/dashboard.service";
import { useToast } from "@/components/ui/use-toast";
import GenericFormField from "@/components/GenericFormField";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";



const formSchema = z.object({
  weight: z.coerce.number(),
  height: z.coerce.number(),
});

type ChildComponentProps = {
  record: PatientRecord;
  onChangeState: () => void;
};

const EditPatientDetailsModal: React.FC<ChildComponentProps> = ({
  record,
  onChangeState,
}) => {
  // Open and close the modal
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  // Edit patient data
  const [patientRecord, editPatientRecord] = useState<PatientRecord | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: record.weight,
      height: record.height,
      //injuries: record.injuries,
    },
  });

  useEffect(() => {
    form.reset({
      weight: record.weight,
      height: record.height,

    });
  }, [record, form]);

  const updateRecord = async (record: PatientRecord) => {
    try {
      await updatePatientRecord(record);
      // Show success toast message
      toast({
        variant: "success",
        title: "Record Updated Successfully",
        description: `The patient ${patientRecord?.patient.fullname} record has been updated.`,
      });
      onChangeState();
    } catch (e: any) {
      console.error(e);
      // Show error toast message
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: `${e.response?.data?.message ?? DEFAULT_ERROR_MESSAGE}`,
      });
    }
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setOpenDialog(false);
    const updatedRecord: PatientRecord = {
      ...record,
      ...data,
    };
    editPatientRecord(updatedRecord);

    updateRecord(updatedRecord);

  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="flex gap-2" variant="outline">
          <Pencil size={20} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Patient Record</DialogTitle>
          <DialogDescription>Edit patient details here</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* <ScrollArea className="flex flex-col items-start h-[240px] ml-2"> */}
              <GenericFormField
                control={form.control}
                name="weight"
                label="Weight"
                type="number"
              />

              <GenericFormField
                control={form.control}
                name="height"
                label="Height"
                type="number"
              />

              

            <DialogFooter className="w-full">
              <Button className="w-1/2" type="submit">
                Edit
              </Button>
              <DialogClose asChild>
                <Button className="w-1/2" type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientDetailsModal;
