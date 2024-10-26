import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { CreatePatientRecord } from "@/services/dashboard.service";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getAllPatient,
  insertPatientRecord,
} from "@/services/dashboard.service";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/dashboard";
import GenericFormField from "@/components/GenericFormField";
import { Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  patient: z.string(),
  weight: z.coerce
    .number()
    .min(0, { message: "Weight must be a positive number." }),
  height: z.coerce
    .number()
    .min(0, { message: "Height must be a positive number." }),
  injuries: z.array(
    z
      .object({
        painRegion: z.string(),
        painScore: z.coerce.number(),
        duration: z.string(),
        is_recurrent: z.enum(['YES', 'NO']),
        description: z.string(),
      })
      
  ),
});

interface InsertPatientRecordModalProps {
  onPatientAdded: () => void;
}

const InsertPatientRecordModal: React.FC<InsertPatientRecordModalProps> = ({
  onPatientAdded,
}) => {
  const { isLoading, withLoading } = useLoading();
  const [patient, setPatient] = useState<User[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllPatient();
      setPatient(data);
    };

    withLoading(getData);
  }, []);
  const { toast } = useToast();
  // Open and close the modal
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: "No patient selected",
      weight: 0,
      height: 0,
      injuries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "injuries",
  });

  const { reset } = form;

  const addPatient = async (patientRecord: CreatePatientRecord) => {
    if (patientRecord) {
      try {
        await insertPatientRecord(patientRecord);
        toast({
          variant: "success",
          title: "Patient Added Successfully",
          description: "The patient record has been added.",
        });

        onPatientAdded();
      } catch (e: any) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Add Patient Failed",
          description: `${e.response.data.message}`,
        });
      }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpenDialog(false);
    const updatedRecord = {
      patientId: values.patient,
      weight: values.weight,
      height: values.height,
      injury: values.injuries
    };

    // TODO: Currently it trigger error when i try run build, uncomment this when it is fixed
    // addPatient(updatedRecord);

    reset({
      patient: "",
      weight: 0,
      height: 0,
    });
  }

  useEffect(() => {
    if (openDialog) {
      reset({
        patient: "Select a patient",
        weight: 0,
        height: 0,
      });
    }
  }, [openDialog, reset]);

  return (
    <Sheet open={openDialog} onOpenChange={setOpenDialog}>
      <SheetTrigger asChild>
        <Button variant="outline">Insert</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Add new patient</SheetTitle>
          <SheetDescription>
            Insert a new patient record here
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-1">
            <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-260px)]">
              <div className="flex flex-col gap-1">
              <GenericFormField
                control={form.control}
                name="patient"
                label="Patient"
                type="select"
                placeholder="Select a patient"
                options={patient.map((patient) => ({
                  value: patient.id,
                  label: patient.username,
                }))}
              />

              <GenericFormField
                control={form.control}
                name="weight"
                label="Weight"
                type="number"
                placeholder="Enter weight"
              />

              <GenericFormField
                control={form.control}
                name="height"
                label="Height"
                type="number"
                placeholder="Enter height"
              />

              {/* Injuries Field */}
              <div>
                <div className="flex justify-between items-center mt-5">
                  <span className="font-semibold">Injuries</span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      append({
                        painRegion: "",
                        painScore: 0,
                        duration: "",
                        is_recurrent: "NO",
                        description: "",
                      })
                    }
                  >
                    Add Injury
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="relative border p-2 mt-5">
                    <Badge variant="secondary">Injury {index + 1}</Badge>
                    <Trash2
                      size={26}
                      color="#ff0000"
                      className="absolute right-2 top-2  hover:bg-table-100 p-1 rounded-md"
                      onClick={() => remove(index)}
                    />
                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.painRegion`}
                      label="Pain Region"
                      type="input"
                      placeholder="Enter pain region"
                    />

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.painScore`}
                      label="Pain Score"
                      type="number"
                      placeholder="Enter pain score"
                    />

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.duration`}
                      label="Duration"
                      type="input"
                      placeholder="Enter duration"
                    />

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.is_recurrent`}
                      label="Recurrent?"
                      type="select"
                      options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" }
                      ]}
                      placeholder="Select an option"
                    />

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.description`}
                      label="Injury Description"
                      type="textarea"
                      placeholder="Describe the injury"
                    />
                  </div>
                ))}
              </div>
              <SheetFooter className="w-full mt-5">
              <Button className="w-1/2" type="submit">
                Insert
              </Button>
              <SheetClose asChild>
                <Button className="w-1/2" type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
            </div>
            </ScrollArea>
           
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InsertPatientRecordModal;
