import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Edit,
  MessageCircle,
  Ruler,
  Trash,
  Weight,
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
  deletePatientRecord,
  getPatientRecordDetails,
} from "@/services/dashboard.service";
import EditPatientDetailsModal from "./EditPatientDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [record, setRecord] = useState<PatientRecord>(
    createDefaultPatientRecord
  );

  const getData = async () => {
    if (recordId) {
      const data = await getPatientRecordDetails(recordId);
      console.log(data);
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

  // Text Copy Logic
  const [textToCopy, setTextToCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1000);
  };

  // Edit

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
                src={record.patient.profileImageUrl}
              />
              <div className="flex flex-col gap-3">
                <h2>{record.patient.username}</h2>
                <div className="flex flex-col text-sm  gap-1">
                  <span>IC NO : {record.patient.ic}</span>
                  <span>Age : {record.patient.age}</span>
                  <Badge className="w-16 text-center" variant="secondary">
                    {record.patient.gender}
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
          )}

          <Link className="flex flex-start" to="/dashboard/chat">
            <Button className="flex gap-4" size="lg">
              <MessageCircle />
              Message Patient
            </Button>
          </Link>
        </div>
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
      </section>

      <Tabs defaultValue="Overview" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="Overview">Overview</TabsTrigger>
          <TabsTrigger value="Assessment">Assessment</TabsTrigger>
          <TabsTrigger value="Rehabilitation">Rehabilitation</TabsTrigger>
        </TabsList>

        <TabsContent value="Overview">
          <section>
            {/* Vital Signs Section */}
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold">Vital Signs</h3>
              {isLoading ? (
                <SkeletonContent />
              ) : (
                <div className="flex gap-2 w-1/2 mb-2">
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Patient's Height (In meters)
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
                        Patient's Weight (In kilograms)
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
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold">Injury Report</h3>
              <div className="grid grid-cols-2 gap-6">
                {record.injuries.map((injury) => (
                  <Card
                    key={injury.id}
                    className="relative p-4 shadow-md rounded-lg"
                  >
                    <ul className="flex flex-col gap-4">
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
                    {/* Edit and Delete Icons */}
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <Edit className="cursor-pointer" size={18} />
                      <Trash className="cursor-pointer" size={18} />
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
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientDetailPage;
