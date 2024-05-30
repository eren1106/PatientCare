import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  patientname: z.enum(["None", "James Johnson", "Sarah Williams"]),
});
const patientList = ["None", "James Johnson", "Sarah Williams"] as const;
type PatientName = (typeof patientList)[number];

const InsertPatientRecordModal = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<PatientName>("None");

  // Open and close the modal
  const [openDialog, setOpenDialog] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientname: "None",
    },
  });
  const { setValue } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpenDialog(false);
  }
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start space-y-5"
          >
            <FormField
              control={form.control}
              name="patientname"
              render={() => (
                <FormItem className="flex items-center gap-5">
                  <FormLabel>Patient</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {selectedPatient !== "None"
                            ? selectedPatient
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
                              {patientList.map((patient) => (
                                <CommandItem
                                  key={patient}
                                  value={patient}
                                  onSelect={(currentValue : string) => {
                                    const selectedValue = currentValue as PatientName;
                                    setSelectedPatient(selectedValue);
                                    setValue('patientname', selectedValue);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPatient === patient
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {patient}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
