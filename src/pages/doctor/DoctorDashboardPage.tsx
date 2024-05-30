import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_PATIENT_LIST } from "@/constants";
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
import React from "react";
import { Label } from "@/components/ui/label";

const DoctorDashboardPage = () => {
  const [deleteModal, setDeleteModal] = React.useState(false);
  const id = useParams();

  const removePatient = () => {
    setDeleteModal(true);
  }
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
            <h3 className="text-white font-semibold">12</h3>
            <p className="text-white text-xs">Total Patients</p>
          </span>
        </div>
      </section>
      <div className="border border-gray-300 rounded-lg p-5 mt-10 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Patient Record</span>
          <InsertPatientRecordModal />
        </div>

        <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="">Patient</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Upcoming Appointments</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PATIENT_LIST.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.patient}</TableCell>
                <TableCell>{patient.contactNumber}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.upcomingAppointments}</TableCell>
                <TableCell>{patient.dateCreated}</TableCell>
                <TableCell className="flex items-center justify-start gap-3 ">
                  <Link to={`patients/${id}`}>
                    <Eye
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full"
                    />
                  </Link>
                  <Trash
                    size={36}
                    className="hover:bg-table-100 p-2 rounded-full"
                    onClick={removePatient}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
};

export default DoctorDashboardPage;
