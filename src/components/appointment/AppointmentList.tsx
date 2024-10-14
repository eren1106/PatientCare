import { Appointment } from "@/interfaces/appointment";
import { Card } from "../ui/card";
import { formatDate, formatTime } from "@/utils";

interface AppointmentListProps {
  appointments: Appointment[];
  onClick?: (appointment: Appointment) => void;
  isDoctor?: boolean;
}

const AppointmentList = ({ appointments, onClick, isDoctor=true }: AppointmentListProps) => {
  // Filter for only upcoming appointments
  const upcomingAppointments = appointments.filter((appointment) => new Date(appointment.startTime) > new Date());

  return (
    <div className="flex flex-col gap-3">
      <h2>Upcoming Appointments:</h2>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <Card key={appointment.id} className="p-3 cursor-pointer" onClick={() => onClick?.(appointment)}>
            <h4>{appointment.title}</h4>
            <p>{appointment.description}</p>
            <p className="text-sm">{formatDate(appointment.date)}</p>
            <p className="text-sm text-muted-foreground">{`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}</p>
            <p className="font-medium">{`${isDoctor ? 'Patient' : 'Doctor'}: ${isDoctor ? appointment.patient?.fullname : appointment.doctor?.fullname}`}</p>
          </Card>
        ))
      ) : (
        <p>No upcoming appointments</p>
      )}
    </div>
  );
};

export default AppointmentList;
