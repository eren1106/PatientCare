import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, MessageCircle, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import React from "react";

const PatientDetailPage = () => {

  // Edit Modal
  const [editModal, setEditModal] = React.useState(false);
  const openEditModal = () => {
    setEditModal(true);
  }
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = React.useState(false);
  const openDeleteModal = () => {
    setDeleteModal(true);
  }

  // Text Copy Logic
  const [textToCopy, setTextToCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
  };

  // Edit modal
  

  const { toast } = useToast();
  const displayToastMessage = () => {
    toast({
      variant: "success",
      title: "Copied",
      description: "Copied text to your clipboard",
    });
  };


  const patientDetails = [
    { label: "Weight", value: "80 kg" },
    { label: "Height", value: "1.78 m" },
    { label: "Blood Type", value: "O+" },
    { label: "Blood Pressure", value: "124/79 mmHg" },
  ];
  // Mild moderate severe
  const patientInjury = [
    { label: "Injury Type", value: "Rotator Cuff Injury" },
    { label: "Severity", value: "Light" },
  ];

  const vitalSigns = [
    { label: "Heart Rate", value: "72 bpm" },
    { label: "Blood Pressure", value: "120/80 mmHg" },
    { label: "Respiratory Rate", value: "16 breaths/min" },
    { label: "Body Temperature", value: "98.6 °F" },
    { label: "Oxygen Saturation", value: "98%" },
  ];

  const mockCompletedAssessments = [
    {
      name: "Knee Injury and Osteoarthritis Outcome Score",
      status: "Completed",
      review: "Good",
      dateCreated: "2024-01-15",
      dateCompleted: "2024-01-15"
    },
    {
      name: "Knee Injury and Osteoarthritis Outcome Score",
      status: "Assigned",
      review: "Good",
      dateCreated: "2024-02-20",
      dateCompleted: "2024-01-15"
    },
    // Add more completed assessments here
  ];
  
  const mockExercises = [
    "Exercise 1",
    "Exercise 2",
    "Exercise 3",
    // Add more exercises here
  ];


  return (
    <Card className="p-4">
      {/*Patient Profile Section*/}
      <section className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            <ProfileAvatar
              className="size-28"
              src="data:image/jpeg;base64,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"
            />
            <div className="flex flex-col gap-2">
              <h2>Zheng Wu Bang</h2>
              <div className="flex flex-col text-sm">
                <span>Patient ID : #DOC8121</span>
                <span>Age : 32</span>
                <span>Gender : Female</span>
                <div className="flex gap-2 items-center">
                  <a
                    className="text-blue-600 hover:text-blue-400"
                    href="mailto:s2132122@gmail.com"
                  >
                    s2132122@gmail.com
                  </a>
                  <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                    <Copy
                      className=" block hover:bg-gray-100"
                      size={14}
                      onClick={displayToastMessage}
                    />
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
          <Button className="flex gap-4" variant="message" size="lg">
            <MessageCircle />
            Message Patient
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="flex gap-2" variant="outline" onClick={openEditModal}>
            <Pencil size={20} />
            Edit
          </Button>
          <Button className="flex gap-2" variant="outline" onClick={openDeleteModal}>
            <Trash size={20} />
            Delete
          </Button>
        </div>
      </section>

      <Tabs defaultValue="Overview" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="Overview">Overview</TabsTrigger>
          <TabsTrigger value="Assessment">Assessment</TabsTrigger>
          <TabsTrigger value="Rehabilitation">Rehabilitation</TabsTrigger>
        </TabsList>

        <TabsContent value="Overview">
          <section>
            <Card className="flex  flex-col p-4 gap-8 w-full">
              <div className="flex flex-col gap-5">
                <h3 className="font-semibold">Patient Information</h3>
                <ul>
                  {patientDetails.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-light-foreground">
                        {item.label} :
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="font-semibold">Injury Details</h3>
                <ul className="flex flex-col gap-3">
                  {patientInjury.map((item, index) =>
                    item.label === "Severity" ? (
                      <li key={index} className="flex justify-between">
                        <span className="text-light-foreground">
                          {item.label} :
                        </span>
                        {item.value === "Severe" && (
                          <Badge variant="destructive">{item.value}</Badge>
                        )}

                        {item.value === "Moderate" && (
                          <Badge variant="secondary">{item.value}</Badge>
                        )}

                        {item.value === "Light" && <Badge>{item.value}</Badge>}
                      </li>
                    ) : (
                      <li key={index} className="flex justify-between">
                        <span className="text-light-foreground">
                          {item.label} :
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </li>
                    )
                  )}
                  <li className="flex flex-col gap-2">
                    <span className="text-light-foreground">Cause</span>
                    <span className="text-sm rounded-md bg-light-blue font-light p-2 ">
                      Injured when collding with other players in a football
                      match
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="font-semibold">Vital Signs</h3>
                <ul>
                  {vitalSigns.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-light-foreground">
                        {item.label} :
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </section>
        </TabsContent>
        <TabsContent value="Assessment">
          <div className="p-4">
         
            <div className="flex items-center space-x-4 mb-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Select Exercise</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Exercise</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {mockExercises.map((exercise, index) => (
                      <DropdownMenuItem key={index}>
                        {exercise}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Card className="flex flex-col p-4 gap-4 w-full">

            <h3 className="font-semibold">Assessments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Questionnaire</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Date Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompletedAssessments.map((assessment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {assessment.name}
                    </TableCell>
                    <TableCell>{assessment.status}</TableCell>
                    <TableCell>{assessment.review}</TableCell>
                    <TableCell>{assessment.dateCreated}</TableCell>
                    <TableCell>{assessment.dateCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total: {mockCompletedAssessments.length} assessments
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            </Card>
           
          </div>
        </TabsContent>
        <TabsContent value="Rehabilitation">
          Rehabilitation Exercises Here
        </TabsContent>
      </Tabs>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader >
            <DialogTitle>Remove Patient</DialogTitle>
            <p className="text-center p-2">Are you sure to remove this patient?</p>
          </DialogHeader>
          <DialogFooter className="w-full">
              <Button className="w-1/2" variant="destructive" type="submit">
                Remove
              </Button>
              <DialogClose asChild>
                <Button className="w-1/2" type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </Card>
  );
};

export default PatientDetailPage;
