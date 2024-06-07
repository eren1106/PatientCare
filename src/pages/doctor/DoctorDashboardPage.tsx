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
import { deletePatientRecord, getPatientRecord } from "@/services/dashboard.service";
import { PatientRecord } from "@/interfaces/dashboard";
import useLoading from "@/hooks/useLoading.hook";
import SkeletonCard from "@/components/SkeletonCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";

const DoctorDashboardPage = () => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [removeRecordId, setRemoveRecordId] = useState('');
  const removePatient = (patientRecordId : string) => {
    setDeleteModal(true);
    setRemoveRecordId(patientRecordId);
  };

  const remove = () => {
    const deleteRecord = deletePatientRecord(removeRecordId);
    setPatientRecord((prevRecords) =>
      prevRecords.filter((record) => record.id !== removeRecordId)
    );
    setDeleteModal(false);
    setRemoveRecordId('');
  }
  // Fetch patient records
  const [patientRecord, setPatientRecord] = useState<PatientRecord[]>([]);
  const { isLoading, withLoading } = useLoading();

  // Date helper
  const convertDateFormat = (date: Date): string => {
    const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
    const [hours, minutes, amPm] = [date.getHours() % 12 || 12, date.getMinutes(), date.getHours() >= 12 ? 'p.m.' : 'a.m.'];
    return `${day}/${month}/${year} ${hours}:${minutes.toString().padStart(2, '0')}${amPm}`;
  };  

  const [refresh, setRefresh] = useState(false);
  const fetchData = useCallback( async () => {
    const data = await getPatientRecord();
    console.log(data);
    setPatientRecord(data);
    setRefresh(false); 
  }, [])
  
  useEffect(() => {
    if (refresh) {
      withLoading(fetchData);
    }
  }, [refresh,fetchData]);

  useEffect(() => {
    withLoading(fetchData);
  }, [fetchData]);

  const handlePatientAdded = () => {
    setRefresh(true);
  };

  return (
    <div>
      <h2 className="font-semibold">Welcome back, Dr. Samiha </h2>
      <p className="text-sm text-gray-500 mt-1">
        Have a nice day and great work
      </p>
      <section className="w-full flex gap-5 mt-5 ">
        <div className="w-1/5 flex items-center justify-center px-4 py-6 gap-4 bg-purple-400 rounded-lg">
          <div className="rounded-full bg-purple-300 p-3 ">
            <Calendar color="#ffffff" />
          </div>
          <span className="flex flex-col ">
            <h3 className="text-white font-semibold">12</h3>
            <p className="text-white text-xs">Appointments</p>
          </span>
        </div>

        <div className="w-1/5 flex items-center justify-center px-4 py-6 gap-4 bg-blue-400 rounded-lg">
          <div className="rounded-full bg-blue-300 p-3 ">
            <User color="#ffffff" />
          </div>
          <span className="flex flex-col ">
            <h3 className="text-white font-semibold">{patientRecord.length}</h3>
            <p className="text-white text-xs">Total Patients</p>
          </span>
        </div>
      </section>
      <div className="border border-gray-300 rounded-lg p-5 mt-10 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Patient Record</span>
          <InsertPatientRecordModal onPatientAdded={handlePatientAdded}/>
        </div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <Table className="mt-2 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="">Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Upcoming Appointments</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientRecord.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.patient.username}
                    </TableCell>
                    <TableCell>{record.patient.email}</TableCell>
                    <TableCell>
                      {record.appointment.length > 0 ? (
                        <ul>
                          {record.appointment.map((appt) => (
                            <li key={appt.id}>
                              <Badge variant="secondary">{convertDateFormat(new Date(appt.scheduledDatetime))}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No Appointments"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{convertDateFormat(new Date(record.createdDatetime))}</Badge>
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
                        onClick={() => {removePatient(record.id)}}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        
      </div>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Patient</DialogTitle>
            <p className="text-center p-2">
              Are you sure to remove this patient?
            </p>
          </DialogHeader>
          <DialogFooter className="w-full">
            <Button className="w-1/2" variant="destructive" onClick={() => remove()}>
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
    </div>
  );
};

export default DoctorDashboardPage;
