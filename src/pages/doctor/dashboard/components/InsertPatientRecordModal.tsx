import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  getAllPatient,
  insertPatientRecord,
} from "@/services/dashboard.service";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import {
  CreatePatientRecord,
  PatientRecord,
  User,
} from "@/interfaces/dashboard";
import SkeletonCard from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  patient: z.object({
    id: z.string(),
  }),
  ic_no: z.string().min(1, { message: "Required." }),
  age: z.number().min(0, { message: "Age must be a positive number." }),
  gender: z.enum(["MALE", "FEMALE"]),
  weight: z.number().min(0, { message: "Weight must be a positive number." }),
  height: z.number().min(0, { message: "Height must be a positive number." }),
});

interface InsertPatientRecordModalProps {
  onPatientAdded: () => void;
}

const InsertPatientRecordModal: React.FC<InsertPatientRecordModalProps> = ({
  onPatientAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  const { isLoading, withLoading } = useLoading();
  const [patient, setPatient] = useState<User[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllPatient();
      setPatient(data);
    };

    withLoading(getData);
  }, []);

  // Open and close the modal
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ic_no: "",
      age: 0,
      gender: "MALE",
      weight: 0,
      height: 0,
    },
  });

  const { setValue } = form;

  const [patientRecord, setPatientRecord] = useState<CreatePatientRecord>({
    patientId: "",
    ic_no: "",
    age: 0,
    gender: "",
    weight: 0,
    height: 0,
  });

  const addPatient = async (patientRecord:CreatePatientRecord) => {
    if (patientRecord) {
      const data = await insertPatientRecord(patientRecord);
      onPatientAdded();
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpenDialog(false);
    const updatedRecord = {
      patientId: values.patient.id,
      ic_no: values.ic_no,
      age: values.age,
      gender: values.gender,
      weight: values.weight,
      height: values.height,
    };
    setPatientRecord(updatedRecord);

    addPatient(updatedRecord); 
  }

  const handleSelect = (patient: User) => {
    setSelectedPatient(patient);
    setValue("patient", patient);
    setOpen(false);
  };

  const getClassName = (selectedPatient: User | null, patient: User) => {
    return cn(
      "mr-2 h-4 w-4",
      selectedPatient === patient ? "opacity-100" : "opacity-0"
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Insert</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new patient</DialogTitle>
          <DialogDescription>
            Insert a new patient record here
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <ScrollArea className="flex flex-col items-start ">
              <FormField
                control={form.control}
                name="patient"
                render={() => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Patient</FormLabel>
                    <div>
                      <FormControl className="flex flex-col items-center justify-between">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {selectedPatient
                                ? selectedPatient.username
                                : "Select a patient"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Search a patient" />
                                <CommandEmpty>No patient found.</CommandEmpty>
                                <CommandGroup>
                                  {isLoading ? (
                                    <SkeletonCard />
                                  ) : (
                                    patient.map((patient) => (
                                      <CommandItem
                                        key={patient.id}
                                        value={patient.username}
                                        onSelect={() => handleSelect(patient)}
                                      >
                                        <Check
                                          className={getClassName(
                                            selectedPatient,
                                            patient
                                          )}
                                        />
                                        {patient.username}
                                      </CommandItem>
                                    ))
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

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
            </ScrollArea>
            <DialogFooter className="w-full">
              <Button className="w-1/2" type="submit">
                Insert
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

export default InsertPatientRecordModal;
