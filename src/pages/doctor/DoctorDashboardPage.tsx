import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Eye, Trash, User } from "lucide-react";
import InsertPatientRecordModal from "./dashboard/components/InsertPatientRecordModal";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
import { useCallback, useEffect, useState } from "react";
import {
  deletePatientRecord,
  getPatientRecord,
} from "@/services/dashboard.service";
import { PatientRecord, PatientTable } from "@/interfaces/dashboard";
import useLoading from "@/hooks/useLoading.hook";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/auth.service";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";

const DoctorDashboardPage = () => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [removeRecordId, setRemoveRecordId] = useState("");
  const removePatient = (patientRecordId: string) => {
    setDeleteModal(true);
    setRemoveRecordId(patientRecordId);
  };
  const { toast } = useToast();
  const remove = async () => {
    try {
      const deleteRecord = await deletePatientRecord(removeRecordId);
      toast({
        variant: "success",
        title: "Patient Record Deleted Successfully",
        description: "The patient record has been deleted.",
      });
      setPatientRecord((prevRecords) =>
        prevRecords.filter((record) => record.id !== removeRecordId)
      );
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
  // Fetch patient records
  const [patientRecord, setPatientRecord] = useState<PatientTable[]>([]);
  const { isLoading, withLoading } = useLoading();

  // Date helper
  const convertDateFormat = (date: Date): string => {
    const [day, month, year] = [
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    ];
    const [hours, minutes, amPm] = [
      date.getHours() % 12 || 12,
      date.getMinutes(),
      date.getHours() >= 12 ? "p.m." : "a.m.",
    ];
    return `${day}/${month}/${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")}${amPm}`;
  };

  const [refresh, setRefresh] = useState(false);
  const fetchData = useCallback(async () => {
    const data = await getPatientRecord();
    setPatientRecord(data);
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

  const handlePatientAdded = () => {
    setRefresh(true);
  };

  // Search function
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecords = patientRecord.filter((record) =>
    record.patient.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div >
      <div className="flex items-center ">
        <h2 className="font-semibold">
          Welcome back, Dr. {getCurrentUser()?.fullname}
        </h2>
        <span className="text-3xl animate-wave origin-wave inline-block">
          👋
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Have a nice day and great work
      </p>
      <section className="grid grid-cols-1 mt-2 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientRecord.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientRecord.length}</div>
          </CardContent>
        </Card>
      </section>
      <Card className="p-3 sm:p-5 mt-5 sm:mt-10 gap-2">
        <div  className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
          <span className="text-lg sm:text-xl font-semibold">Patient Record</span>
          <Input
            className="w-full sm:w-1/3"
            type="text"
            placeholder="Search a patient..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <InsertPatientRecordModal onPatientAdded={handlePatientAdded} />
        </div>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Table className="mt-2 w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Age</TableHead>
                {/* <TableHead>Appointments</TableHead> */}
                <TableHead className="hidden sm:table-cell">Date Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <ProfileAvatar
                        src={record.patient.profileImageUrl ?? undefined}
                        fallbackText={record.patient.fullname?.charAt(0)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.patient.fullname}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{record.patient.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">{record.patient.age}</TableCell>
                    {/* <TableCell>
                      {record.appointment.length > 0 ? (
                        <ul>
                          {record.appointment.map((appt) => (
                            <li key={appt.id}>
                              <Badge variant="secondary">
                                {convertDateFormat(
                                  new Date(appt.scheduledDatetime)
                                )}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Badge variant="secondary">-</Badge>
                      )}
                    </TableCell> */}
                    <TableCell className="hidden sm:table-cell">
                      {/* <Badge variant="secondary">
                        {convertDateFormat(
                          new Date(record.patient.createdDatetime)
                        )}
                      </Badge> */}
                      {convertDateFormat(
                        new Date(record.patient.createdDatetime)
                      )}
                    </TableCell>
                    <TableCell className="flex items-center justify-start gap-3 ">
                      <Link to={`patients/${record.id}`}>
                        <Eye
                          size={36}
                          className="hover:bg-table-100 p-2 rounded-full"
                        />
                      </Link>
                      <Trash
                        size={36}
                        className="hover:bg-table-100 p-2 rounded-full"
                        onClick={() => {
                          removePatient(record.id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No patient records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Patient Record</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {`Are you sure to remove this patient record ? This action cannot be undone.`}
          </DialogDescription>
          <div></div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => remove()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DoctorDashboardPage;
