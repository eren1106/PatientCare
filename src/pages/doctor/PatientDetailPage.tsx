import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Copy,
  Edit,
  MessageCircle,
  Ruler,
  Trash,
  Weight,
  Activity,
  Clock,
  FileText,
  MapPin,
  Repeat,
  Calendar
} from "lucide-react";
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
import { DialogDescription } from "@radix-ui/react-dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/utils";

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
  const onCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus(true);
      toast({
        variant: "success",
        title: "Copied",
        description: "Copied text to your clipboard",
      });
      setTimeout(() => setCopyStatus(false), 1000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
      });
    }
  };

  const { toast } = useToast();


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
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Patient Injury Deleted Successfully",
          description: `${
            error.response?.data?.message ?? DEFAULT_ERROR_MESSAGE
          }`,
        });
      }
    }
  };

  return (
    <Card className="relative p-4 sm:p-6">
      <Button
        variant="ghost"
        className="absolute"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
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
              <span className="text-md sm:text-lg font-semibold ">
                Vital Signs
              </span>
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
                <span className="text-md sm:text-lg font-semibold ">
                  Injury Report
                </span>
                <Button variant="secondary" onClick={handleCreateClick}>
                  Create Injury
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {record.injuries.map((injury) => (
                  <Card
                    key={injury.id}
                    className="relative overflow-hidden"
                  >
                    {/* Header with gradient */}
                    <div className="absolute top-0 right-0 left-0 h-1 " />

                    {/* Edit and Delete Icons */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Edit
                        className="cursor-pointer hover:bg-blue-100 rounded-full p-1.5 text-blue-600 transition-colors"
                        size={32}
                        onClick={() => handleEditClick(injury)}
                      />
                      <Trash
                        className="cursor-pointer hover:bg-red-100 rounded-full p-1.5 text-red-600 transition-colors"
                        size={32}
                        onClick={() => handleDeleteClick(injury.id)}
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Pain Region with Icon */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Pain Region
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {injury.painRegion || "N/A"}
                          </h3>
                        </div>
                      </div>

                      {/* Pain Score with colored indicator */}
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            NRS Pain Score
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-bold ${
                                Number(injury.painScore) >= 7
                                  ? "text-red-500"
                                  : Number(injury.painScore) >= 4
                                  ? "text-orange-500"
                                  : "text-green-500"
                              }`}
                            >
                              {injury.painScore || "N/A"}
                            </span>
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  Number(injury.painScore) >= 7
                                    ? "bg-red-500"
                                    : Number(injury.painScore) >= 4
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${
                                    (Number(injury.painScore) / 10) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Duration with Icon */}
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Duration
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {injury.duration || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Recurrent Status with Icon */}
                      <div className="flex items-start gap-3">
                        <Repeat className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Recurrent
                          </p>
                          <Badge
                            variant={
                              injury.is_recurrent === "YES"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-1"
                          >
                            {injury.is_recurrent}
                          </Badge>
                        </div>
                      </div>

                      {/* Additional Information with Icon */}
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Additional Information
                          </p>
                          <p className="text-gray-700 mt-1">
                            {injury.description || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Date Recorded
                          </p>
                          <p className="text-gray-700 mt-1">
                            {injury.createdDatetime ? formatDate(injury.createdDatetime) : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
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

 

      <AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to remove this patient record ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => remove()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Render the UpdateInjuryForm dialog */}
      <InjuryForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        injury={selectedInjury}
        onUpdate={handlePatientEdited}
        isCreateMode={isCreateMode}
        patientRecordId={record.id}
      />

      <AlertDialog open={deleteInjuryModal} onOpenChange={setDeleteInjuryModal}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Injury</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to remove this injury? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeInjury}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PatientDetailPage;
