import { Appointment } from "@/interfaces/appointment";
import { Card } from "../ui/card";
import { formatDate, formatTime } from "@/utils";
import { ClipboardList } from "lucide-react";
import ProfileAvatar from "../ProfileAvatar";
import { Badge } from "../ui/badge";
import Dot from "../Dot";

interface AppointmentListProps {
  appointments: Appointment[];
  onClick?: (appointment: Appointment) => void;
  isDoctor?: boolean;
}

const AppointmentList = ({ appointments, onClick, isDoctor = true }: AppointmentListProps) => {
  // Filter for only upcoming appointments
  const upcomingAppointments = appointments.filter((appointment) => new Date(appointment.startTime) > new Date());

  return (
    <div className="flex flex-col gap-3">
      <h2>Upcoming Appointments:</h2>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <Card key={appointment.id} className="p-3 cursor-pointer flex flex-col gap-3 max-w-[40rem]" onClick={() => onClick?.(appointment)}>
            <div>
              <p className="font-medium">{appointment.title}</p>
              <p className="text-sm text-muted-foreground">{`${formatDate(appointment.date)}, ${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}</p>
            </div>
            <div className="flex items-center gap-1">
              <ClipboardList size={16} />
              <p>{appointment.description}</p>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <ProfileAvatar
                  src={isDoctor ? appointment.patient?.profileImageUrl ?? "" : appointment.doctor?.profileImageUrl ?? ""}
                  className="size-6"
                />
                <p className="text-sm">{isDoctor && "Dr."} {isDoctor ? appointment.patient?.fullname : appointment.doctor?.fullname}</p>
              </div>
              <Badge variant="outline" className="flex gap-1 items-center">
                <Dot className="size-2 bg-primary" />
                Scheduled
              </Badge>
            </div>
          </Card>
        ))
      ) : (
        <p>No upcoming appointments</p>
      )}
    </div>
  );
};

export default AppointmentList;
