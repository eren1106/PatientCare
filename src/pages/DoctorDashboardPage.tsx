import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useLocation } from "react-router-dom";
import { Eye, Trash } from "lucide-react";

const patientData = [
  {
    patient: "James Johnson",
    contactNumber: "+60112345781",
    email: "jamesjohnson123@gmail.com",
    upcomingAppointments: "No Appointments",
    dateCreated: "Dec 14, 2021",
  },
  {
    patient: "Sarah Williams",
    contactNumber: "+60112345782",
    email: "sarahwilliams456@gmail.com",
    upcomingAppointments: "May 20, 2024",
    dateCreated: "Jan 10, 2022",
  },
];
const DoctorDashboardPage = () => {
  return (
    <div>
      <span className="text-4xl font-semibold">Welcome back, Dr. Samiha </span>

      <div className="border border-gray-300 rounded-lg p-5 mt-10 gap-2">
        <span className="text-xl font-semibold">Patient Record</span>
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
            {patientData.map((patient, index) => (

              
              <TableRow key={index}>
                <TableCell className="font-medium">{patient.patient}</TableCell>
                <TableCell>{patient.contactNumber}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.upcomingAppointments}</TableCell>
                <TableCell>{patient.dateCreated}</TableCell>
                <TableCell className="flex items-center justify-start gap-3 ">
                  <Link to="/patient/{id}">
                      <Eye size={36} className="hover:bg-table-100 p-2 rounded-full"/>
                  </Link>
                  <Trash size={36} className="hover:bg-table-100 p-2 rounded-full"/>
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
