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
import { Eye, Trash } from "lucide-react";
import  InsertPatientRecordModal  from "./dashboard/components/InsertPatientRecordModal";
import { useParams } from 'react-router-dom';

const DoctorDashboardPage = () => {
  const id = useParams();
  return (
    <div>
      <span className="text-4xl font-semibold">Welcome back, Dr. Samiha </span>

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
                  <Link to={`patients/${patient.id}`}>
                    <Eye
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full"
                    />
                  </Link>
                  <Trash
                    size={36}
                    className="hover:bg-table-100 p-2 rounded-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
