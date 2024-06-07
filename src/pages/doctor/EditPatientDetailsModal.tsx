import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment, Assessment, Exercise, Injury, PatientRecord } from "@/interfaces/dashboard";
import { Pencil } from "lucide-react";
import { updatePatientRecord } from "@/services/dashboard.service";



// const injurySchema = z.object({
//   painRegion: z.string().min(1, { message: "Required." }),
//   painScore: z
//     .number()
//     .min(0, { message: "Pain score must be a non-negative number." }),
//   duration: z.string().min(1, { message: "Required." }),
//   is_recurrent: z.enum(["YES", "NO"], { message: "Required." }),
//   description: z.string().optional(),
// });

const formSchema = z.object({
  ic_no: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  age: z.coerce.number(),
  weight: z.coerce.number(),
  height: z.coerce.number(),
  // injuries: z
  //   .array(injurySchema)
    // .nonempty({ message: "At least one injury must be provided." }),
});


type ChildComponentProps = {
  record: PatientRecord,
  onChangeState: () => void
};

const EditPatientDetailsModal: React.FC<ChildComponentProps> = ({ record , onChangeState}) => {
  // Open and close the modal
  const [openDialog, setOpenDialog] = useState(false);

  // Edit patient data
  const [patientRecord, editPatientRecord] = useState<PatientRecord | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ic_no: record.ic_no,
      age: record.age,
      gender: record.gender,
      weight: record.weight,
      height: record.height,
      //injuries: record.injuries,
    },
  });

  useEffect(() => {
    form.reset({
      ic_no: record.ic_no,
      age: record.age,
      gender: record.gender,
      weight: record.weight,
      height: record.height,
      // injuries: record.injuries || [
      //   {
      //     painRegion: "",
      //     painScore: 0,
      //     duration: "",
      //     is_recurrent: "NO",
      //     description: "",
      //   },
      // ],
    });
  }, [record, form]);


  const updateRecord = async (record : PatientRecord) => {

      const data = await updatePatientRecord(record);
      onChangeState();
    
  }
  
  function onSubmit(data: z.infer<typeof formSchema>) {
    setOpenDialog(false);
    const updatedRecord: PatientRecord = {
      ...record,
      ...data
    };
    editPatientRecord(updatedRecord);
    
    updateRecord(updatedRecord);
    
    
    console.log('Updated Record:', updatedRecord);
    
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
          <DialogDescription>
            Edit patient details here
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <ScrollArea className="flex flex-col items-start h-[240px] ml-2">
              <FormField
                control={form.control}
                name="ic_no"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="w-24">IC</FormLabel>
                    <div className="w-[200px]">
                      <FormControl className="flex flex-col">
                        <Input type="text" placeholder="IC Number" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="w-24">Age</FormLabel>
                    <div className="w-[200px]">
                      <FormControl className="flex flex-col">
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="w-24">Gender</FormLabel>
                    <div className="w-[200px]">
                      <FormControl className="flex flex-col">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="w-24">Weight</FormLabel>
                    <div className="w-[200px]">
                      <FormControl className="flex flex-col">
                        <Input
                          type="number"
                          placeholder="Weight"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="w-24">Height</FormLabel>
                    <div className="w-[200px]">
                      <FormControl className="flex flex-col">
                        <Input
                          type="number"
                          placeholder="Height"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              {/* <h3 className="font-bold text-lg mt-5">Injuries</h3>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col space-y-2 border-b pb-2 mb-2"
                >
                  <FormField
                    control={form.control}
                    name={`injuries.${index}.painRegion`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="w-32">Pain Region</FormLabel>
                        <div className="w-[200px]">
                          <FormControl className="flex flex-col">
                            <Input
                              type="text"
                              placeholder="Pain Region"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`injuries.${index}.painScore`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="w-32">Pain Score</FormLabel>
                        <div className="w-[200px]">
                          <FormControl className="flex flex-col">
                            <Input
                              type="number"
                              placeholder="Pain Score"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`injuries.${index}.duration`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="w-32">Duration</FormLabel>
                        <div className="w-[200px]">
                          <FormControl className="flex flex-col">
                            <Input
                              type="text"
                              placeholder="Duration"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`injuries.${index}.is_recurrent`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="w-32">Recurrent</FormLabel>
                        <div className="w-[200px]">
                          <FormControl className="flex flex-col">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="YES">Yes</SelectItem>
                                <SelectItem value="NO">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`injuries.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="w-32">
                          Additional Information
                        </FormLabel>
                        <div className="w-[200px]">
                          <FormControl className="flex flex-col">
                            <Input
                              type="text"
                              placeholder="Additional Information"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              ))} */}
            </ScrollArea>
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
