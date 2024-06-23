import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, MessageCircle, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
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
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import React from "react";
import PatientRecordExerciseTabContent from "./exercises/components/PatientRecordExerciseTabContent";
import PatientRecordQuestionnaireTab from "./questionnaire/components/PatientRecordQuestionnaireTab";
import {
  Appointment,
  Assessment,
  Exercise,
  Injury,
  PatientRecord,
  User,
} from "@/interfaces/dashboard";
import useLoading from "@/hooks/useLoading.hook";
import { deletePatientRecord, getPatientRecordDetails } from "@/services/dashboard.service";
import { Separator } from "@/components/ui/separator";
import EditPatientDetailsModal from "./EditPatientDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

const defaultUser: User = {
  id: "",
  fullname: "",
  username: "",
  email: "",
  profileImageUrl: null,
  createdDatetime: "",
};

const defaultAppointment: Appointment[] = [];

const defaultExercise: Exercise[] = [];

const defaultAssessment: Assessment[] = [];

const defaultInjury: Injury[] = [];

const defaultPatientRecord: PatientRecord = {
  id: "",
  docotr_id: "",
  patientId: "",
  ic_no: "",
  age: 0,
  gender: "MALE",
  weight: 0,
  height: 0,
  progressReport: "",
  createdDatetime: new Date(),
  updatedDatetime: new Date(),
  doctor: defaultUser,
  patient: defaultUser,
  appointment: defaultAppointment,
  exercise: defaultExercise,
  assessment: defaultAssessment,
  injuries: defaultInjury,
};

const SkeletonProfile = () => {
  return (
    <div className="flex gap-6">
      <Skeleton className="rounded-full h-[8rem] w-[8rem]" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-[8rem]" />
        <div className="flex flex-col text-sm gap-3">
          <Skeleton className="h-4 w-[10rem]" />

          <Skeleton className="h-6 w-16" />
          <div className="flex gap-2 items-center">
            <Skeleton className="h-4 w-[10rem]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonContent = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between">
        <Skeleton className="rounded-lg h-[1rem] w-[8rem]" />
        <Skeleton className="rounded-lg h-[1rem] w-[8rem]" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="rounded-lg h-[1rem] w-[8rem]" />
        <Skeleton className="rounded-lg h-[1rem] w-[8rem]" />
      </div>
    </div>
  );
};

const PatientDetailPage = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  // Get data
  const { isLoading, withLoading } = useLoading();
  const [record, setRecord] = useState<PatientRecord>(defaultPatientRecord);

  const getData = async () => {
    if (recordId) {
      const data = await getPatientRecordDetails(recordId);
      console.log(data);
      setRecord(data);
    }
  };


  // Remove patient
  const [removeRecordId, setRemoveRecordId] = useState('');
  const openDeleteModal = (patientRecordId : string) => {
    setDeleteModal(true);
    setRemoveRecordId(patientRecordId);
  };
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = React.useState(false);

  const remove = async () => {
    try {
      const deleteRecord = await deletePatientRecord(removeRecordId);
      toast({
        variant: "success",
        title: "Patient Record Deleted Successfully",
        description: "The patient record has been deleted.",
      });
      navigate('/dashboard');
      setDeleteModal(false);
      setRemoveRecordId('');
    } catch (e:any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Delete Record Failed",
        description: `${e.response.data.message}`,
      });
    }
  };
  const [refresh, setRefresh] = useState(false);
  const fetchData = useCallback(async () => {
    if (recordId) {
      const data = await getPatientRecordDetails(recordId);
      setRecord(data);
    }
    getData;
    setRefresh(false);
  }, []);


  useEffect(() => {
    if (refresh) {
      withLoading(fetchData);
    }
  }, [refresh, fetchData]);

  useEffect(() => {
    withLoading(fetchData);
  }, [fetchData]);

  const handlePatientEdited = () => {
    setRefresh(true);
  };

  // Edit Modal
  const [editModal, setEditModal] = React.useState(false);
  const openEditModal = () => {
    setEditModal(true);
  };


  // Text Copy Logic
  const [textToCopy, setTextToCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000); // Reset status after 2 seconds
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

  const mockCompletedAssessments = [
    {
      name: "Knee Injury and Osteoarthritis Outcome Score",
      status: "Completed",
      review: "Good",
      dateCreated: "2024-01-15",
      dateCompleted: "2024-01-15",
    },
    {
      name: "Knee Injury and Osteoarthritis Outcome Score",
      status: "Assigned",
      review: "Good",
      dateCreated: "2024-02-20",
      dateCompleted: "2024-01-15",
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
          {isLoading ? (
            <SkeletonProfile />
          ) : (
            <div className="flex gap-6">
              <ProfileAvatar
                className="size-32"
                src="https://t3.ftcdn.net/jpg/04/97/68/08/360_F_497680856_nWYZ4OrUdRPAhcPYgaYDxKGV1jHqLjZL.jpg"
              />
              <div className="flex flex-col gap-3">
                <h2>{record.patient.username}</h2>
                <div className="flex flex-col text-sm  gap-1">
                  <span>IC NO : {record.ic_no}</span>
                  <span>Age : {record.age}</span>
                  <Badge className="w-16 text-center" variant="secondary">
                    {record.gender}
                  </Badge>
                  <div className="flex gap-2 items-center">
                    <a
                      className="text-blue-600 hover:text-blue-400"
                      href={`mailto:${record.patient.email}`}
                    >
                      {record.patient.email}
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
          )}

          <Button className="flex gap-4" variant="default" size="lg">
            <MessageCircle />
            Message Patient
          </Button>
        </div>
        <div className="flex gap-2">
          <EditPatientDetailsModal
            record={record}
            onChangeState={handlePatientEdited}
          />
          <Button
            className="flex gap-2"
            variant="outline"
            onClick={() => {openDeleteModal(record.id)}}
          >
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
                <h3 className="font-semibold">Vital Signs</h3>
                {isLoading ? <SkeletonContent/> : (
                  <ul>
                  <li className="flex justify-between">
                    <span className="text-light-foreground">Height (m) :</span>

                    <span className="font-semibold">{record.height}</span>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-light-foreground">Weight (kg):</span>
                    <span className="font-semibold">{record.weight}</span>
                  </li>
                </ul>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="font-semibold">Clinical Presentations</h3>
                {record.injuries.map((injury) => {
                  return (
                    <section className=" p-2 ">
                      <ul className="flex flex-col gap-3">
                        <li className="flex justify-between">
                          <span className="text-light-foreground">
                            Pain Region :
                          </span>
                          <span className="font-semibold">
                            {injury.painRegion ? injury.painRegion : "N/A"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-light-foreground">
                            NRS Pain Score :
                          </span>
                          <span className="font-semibold">
                            {injury.painScore ? injury.painScore : "N/A"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-light-foreground">
                            Duration :
                          </span>
                          <span className="font-semibold">
                            {injury.duration ? injury.duration : "N/A"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-light-foreground">
                            Recurrent :
                          </span>
                          <Badge className="font-semibold">
                            {injury.is_recurrent ? injury.is_recurrent : "N/A"}
                          </Badge>
                        </li>
                        <div className="flex flex-col gap-2">
                          <span className="text-light-foreground">
                            Additional Information :
                          </span>
                          <p className="text-sm">
                            {injury.description ? injury.description : "N/A"}
                          </p>
                        </div>
                      </ul>
                      <Separator className="mt-2" />
                    </section>
                  );
                })}
              </div>
            </Card>
          </section>
        </TabsContent>
        <TabsContent value="Assessment">
          {record.patientId && recordId && (
            <PatientRecordQuestionnaireTab patientId={record.patientId} recordId={recordId} />
          )}
        </TabsContent>
        <TabsContent value="Rehabilitation">
          {
            record.patientId && <PatientRecordExerciseTabContent patientId={record.patientId} />
          }
        </TabsContent>
      </Tabs>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Patient</DialogTitle>
            <p className="text-center p-2">
              Are you sure to remove this patient?
            </p>
          </DialogHeader>
          <DialogFooter className="w-full">
            <Button className="w-1/2" variant="destructive" type="submit" onClick={() => remove()}>
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
