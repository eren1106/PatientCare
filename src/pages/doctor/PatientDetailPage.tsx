import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Edit, MessageCircle, Ruler, Trash, Weight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
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
  createDefaultPatientRecord,
  PatientRecord,
} from "@/interfaces/dashboard";
import useLoading from "@/hooks/useLoading.hook";
import {
  deleteInjury,
  deletePatientRecord,
  getPatientRecordDetails,
  Injury,
} from "@/services/dashboard.service";
import EditPatientDetailsModal from "./EditPatientDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";
import InjuryForm from "./dashboard/components/InjuryForm";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
const SkeletonProfile = () => {
  return (
    <div className="flex flex-col gap-6 m-auto">
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
  const [record, setRecord] = useState<PatientRecord>(
    createDefaultPatientRecord
  );

  const getData = async () => {
    if (recordId) {
      const data = await getPatientRecordDetails(recordId);
      setRecord(data);
    }
  };

  // Remove patient
  const [removeRecordId, setRemoveRecordId] = useState("");
  const openDeleteModal = (patientRecordId: string) => {
    setDeleteModal(true);
    setRemoveRecordId(patientRecordId);
  };

  // Delete Modal
  const [deleteModal, setDeleteModal] = React.useState(false);

  const remove = async () => {
    try {
      await deletePatientRecord(removeRecordId);
      toast({
        variant: "success",
        title: "Patient Record Deleted Successfully",
        description: "The patient record has been deleted.",
      });
      navigate("/dashboard");
      setDeleteModal(false);
      setRemoveRecordId("");
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Delete Record Failed",
        description: `${e.response?.data?.message ?? DEFAULT_ERROR_MESSAGE}`,
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

  // Text Copy Logic
  const [textToCopy, setTextToCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  // Handle edit injury
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const handleCreateClick = () => {
    setIsCreateMode(true); // Switch to create mode
    setSelectedInjury(null); // No injury selected for create mode
    setOpenDialog(true);
  };

  const handleEditClick = (injury: Injury) => {
    setIsCreateMode(false); // Switch to update mode
    setSelectedInjury(injury);
    setOpenDialog(true);
  };

  const { toast } = useToast();
  const displayToastMessage = () => {
    if (copyStatus) {
      toast({
        variant: "success",
        title: "Copied",
        description: "Copied text to your clipboard",
      });
    }
  };

  const [deleteInjuryModal, setDeleteInjuryModal] = useState(false);
  const [injuryIdToDelete, setInjuryIdToDelete] = useState<string | null>(null);

  // Function to open the dialog with the injury ID
  const handleDeleteClick = (id: string) => {
    setInjuryIdToDelete(id);
    setDeleteInjuryModal(true);
  };

  const removeInjury = async () => {
    if (injuryIdToDelete) {
      try {
        await deleteInjury(injuryIdToDelete);
        getData();
        setDeleteInjuryModal(false);
        toast({
          variant: "success",
          title: "Patient Injury Deleted Successfully",
          description: "The patient injury has been deleted.",
        });
      } catch (error : any) {
        toast({
          variant: "destructive",
          title: "Patient Injury Deleted Successfully",
          description: `${error.response?.data?.message ?? DEFAULT_ERROR_MESSAGE}`,
        });
      }
    }
  };

  return (
    <Card className="relative p-4 sm:p-6">
      <Button variant="ghost" className="absolute" onClick={()=> { navigate("/dashboard");}}>
        <ArrowLeft />
      </Button>
      {/*Patient Profile Section*/}
      <section className="flex flex-col">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <SkeletonProfile />
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-center ">
                <ProfileAvatar
                  className="size-24 sm:size-32"
                  src={record.patient.profileImageUrl}
                />
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {record.patient.username}
                  </h2>
                  <Badge className="text-center" variant="secondary">
                    {record.patient.gender}
                  </Badge>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2">
                    <EditPatientDetailsModal
                      record={record}
                      onChangeState={handlePatientEdited}
                    />
                    <Button
                      className="flex gap-2"
                      variant="outline"
                      onClick={() => {
                        openDeleteModal(record.id);
                      }}
                    >
                      <Trash size={20} />
                      Delete
                    </Button>
                  </div>

                  {/* Message Button */}
                  <Link to="/dashboard/chat">
                    <Button size="lg" className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Message Patient
                    </Button>
                  </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">IC:</span>
                    <span className="font-medium">{record.patient.ic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{record.patient.age}</span>
                  </div>

                  <div className="flex items-center gap-2 col-span-full">
                    <span className="text-muted-foreground">Email:</span>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <a
                        className="text-blue-600 hover:text-blue-400 truncate"
                        href={`mailto:${record.patient.email}`}
                      >
                        {record.patient.email}
                      </a>
                      <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                        <Copy
                          className=" block hover:bg-gray-100"
                          size={14}
                          onClick={() => {
                            setTextToCopy(record.patient.email); // Set the text to copy when clicked
                            displayToastMessage();
                          }}
                        />
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Tabs defaultValue="Overview" className="w-full mt-4 ">
        <div className="flex justify-center  sm:justify-start ">
        <TabsList className="w-fit ">
          <TabsTrigger value="Overview">Overview</TabsTrigger>
          <TabsTrigger value="Assessment">Assessment</TabsTrigger>
          <TabsTrigger value="Rehabilitation">Rehabilitation</TabsTrigger>
        </TabsList>
        </div>
        
        <TabsContent value="Overview">
          <section>
            {/* Vital Signs Section */}
            <div className="flex flex-col gap-5 mt-5 px-2">
              <span className="text-md sm:text-lg font-semibold ">Vital Signs</span>
              {isLoading ? (
                <SkeletonContent />
              ) : (
                <div className="flex gap-2 mb-2">
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Height (In meters)
                      </CardTitle>
                      <Ruler size={28} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{record.height}</div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Weight (In kilograms)
                      </CardTitle>
                      <Weight size={28} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{record.weight}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Injury Report Section */}
            <div className="flex flex-col gap-5 px-2">
              <div className="flex justify-between items-center justify-center">
                <span className="text-md sm:text-lg font-semibold ">Injury Report</span>
                <Button variant="secondary" onClick={handleCreateClick}>
                  Create Injury
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {record.injuries.map((injury) => (
                  <Card
                    key={injury.id}
                    className="relative p-4 sm:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                  >
                    {/* Edit and Delete Icons */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Edit
                        className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
                        size={28}
                        onClick={() => handleEditClick(injury)}
                      />
                      <Trash
                        className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
                        size={28}
                        onClick={() => handleDeleteClick(injury.id)}
                      />
                    </div>

                    <ul className="flex flex-col gap-3">
                      <li className="flex flex-col">
                        <span className="text-light-foreground">
                          Pain Region:
                        </span>
                        <span className="font-semibold">
                          {injury.painRegion || "N/A"}
                        </span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-light-foreground">
                          NRS Pain Score:
                        </span>
                        <span className="font-semibold">
                          {injury.painScore || "N/A"}
                        </span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-light-foreground">Duration:</span>
                        <span className="font-semibold">
                          {injury.duration || "N/A"}
                        </span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-light-foreground">
                          Recurrent:
                        </span>
                        <Badge className="font-semibold w-fit">
                          {injury.is_recurrent}
                        </Badge>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-light-foreground">
                          Additional Information:
                        </span>
                        <p className="text-sm">{injury.description || "N/A"}</p>
                      </li>
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="Assessment">
          {record.patientId && recordId && (
            <PatientRecordQuestionnaireTab
              patientId={record.patientId}
              recordId={recordId}
            />
          )}
        </TabsContent>
        <TabsContent value="Rehabilitation">
          {record.patientId && (
            <PatientRecordExerciseTabContent patientId={record.patientId} />
          )}
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
            <Button
              className="w-1/2"
              variant="destructive"
              type="submit"
              onClick={() => remove()}
            >
              Remove
            </Button>
            <DialogClose asChild>
              <Button className="w-1/2" type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>{" "}
      </Dialog>
      {/* Render the UpdateInjuryForm dialog */}
      <InjuryForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        injury={selectedInjury}
        onUpdate={handlePatientEdited}
        isCreateMode={isCreateMode}
        patientRecordId={record.id}
      />

      <Dialog open={deleteInjuryModal} onOpenChange={setDeleteInjuryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Injury</DialogTitle>
            <p className="text-center p-2">
              Are you sure to remove this injury?
            </p>
          </DialogHeader>
          <DialogFooter className="w-full">
            <Button
              className="w-1/2"
              variant="destructive"
              onClick={removeInjury}
            >
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
