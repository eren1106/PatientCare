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
import { Plus, Trash2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";

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
      
  ).optional(),
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
          description: `${e.response?.data?.message ?? DEFAULT_ERROR_MESSAGE}`,
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
      injury: values.injuries?.map(injury => ({
        ...injury
      }))
    };

    addPatient(updatedRecord);

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
      <SheetContent className="sm:max-w-[425px] overflow-hidden">
        <SheetHeader className="px-1">
          <SheetTitle className="text-lg sm:text-xl">Add new patient</SheetTitle>
          <SheetDescription className="text-sm">
            Insert a new patient record here
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full mt-2">
           
              <div className="space-y-1 px-1 ">
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
                label="Weight (kg)"
                type="number"
                placeholder="Enter weight"
              />

              <GenericFormField
                control={form.control}
                name="height"
                label="Height (m)"
                type="number"
                placeholder="Enter height"
              />

              {/* Injuries Field */}
              <div className="flex-1 min-h-0"> 
                <div className="flex justify-between items-center mt-3 mb-3">
                  <span className="font-semibold">Injuries</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
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
                <ScrollArea className="h-[calc(100vh-450px)] px-1">
                <div className="space-y-4 pr-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                    <Badge variant="green">Injury {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.painRegion`}
                      label="Pain Region"
                      type="input"
                      placeholder="Enter pain region"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <GenericFormField
                        control={form.control}
                        name={`injuries.${index}.painScore`}
                        label="Pain Score"
                        type="number"
                        placeholder="Score"
                      />

                      <GenericFormField
                        control={form.control}
                        name={`injuries.${index}.duration`}
                        label="Duration"
                        type="input"
                        placeholder="Duration"
                      />
                    </div>

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.is_recurrent`}
                      label="Recurrent?"
                      type="select"
                      options={[
                        { value: "YES", label: "Yes" },
                        { value: "NO", label: "No" }
                      ]}
                      placeholder="Select"
                    />

                    <GenericFormField
                      control={form.control}
                      name={`injuries.${index}.description`}
                      label="Description"
                      type="textarea"
                      placeholder="Describe the injury"
                    />
                  </div>
                  </div>
                ))}
                </div>
                </ScrollArea>
              </div>
              <SheetFooter className="w-full mt-5 flex gap-2 px-1">
              
              <SheetClose asChild>
                <Button className="flex-1" type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
              <Button className="flex-1" type="submit">
                Insert
              </Button>
            </SheetFooter>
            </div>

           
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default InsertPatientRecordModal;
