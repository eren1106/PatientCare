import { Appointment } from "@/interfaces/appointment";
import { Card } from "../ui/card";
import { formatDate, formatTime, refreshPage } from "@/utils";
import { Check, ClipboardList, X } from "lucide-react";
import ProfileAvatar from "../ProfileAvatar";
import { Badge } from "../ui/badge";
import Dot from "../Dot";
import { Button } from "../ui/button";
import { confirmAppointment } from "@/services/appointment.service";
import { useState } from "react";
import { AppointmentStatus } from "@/enums";
import { toast } from "../ui/use-toast";

interface AppointmentListProps {
  appointments: Appointment[];
  onClick?: (appointment: Appointment) => void;
  isDoctor?: boolean;
}

const AppointmentList = ({ appointments, onClick, isDoctor = true }: AppointmentListProps) => {
  // Filter for only upcoming appointments
  const upcomingAppointments = appointments.filter((appointment) => new Date(appointment.startTime) > new Date());

  const [confirming, setConfirming] = useState(false);
  const handleClickConfirmAppointment = async (id: string, confirm: boolean) => {
    setConfirming(true);
    try {
      await confirmAppointment(id, confirm);
      toast({
        title: `Appointment ${confirm ? "confirmed" : "cancelled"} successfully`,
        variant: "success",
      });
      refreshPage();
    }
    catch (e) {
      console.error(e);
    }
    setConfirming(false);
  }

  const getBadgeProps = (status: string) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return { text: "Confirmed", color: "bg-green-500" };
      case AppointmentStatus.CANCELLED:
        return { text: "Cancelled", color: "bg-red-500" };
      default:
        return { text: "Scheduled", color: "bg-primary" };
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h2>Upcoming Appointments:</h2>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => {
          const { text, color } = getBadgeProps(appointment.status);
          return (
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
                  <p className="text-sm">{!isDoctor && "Dr."} {isDoctor ? appointment.patient?.fullname : appointment.doctor?.fullname}</p>
                </div>
                <Badge variant="outline" className={"flex gap-1 items-center"}>
                  <Dot className={`size-2 ${color}`} />
                  {text}
                </Badge>
              </div>
              {
                (!isDoctor && appointment.status === AppointmentStatus.SCHEDULED) && (
                  <div className="flex items-center gap-2">
                    <p>Are you able to attend this appointment?:</p>
                    <Button
                      size="icon"
                      variant="success"
                      className="size-9"
                      disabled={confirming}
                      onClick={() => handleClickConfirmAppointment(appointment.id, true)}
                    >
                      <Check />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="size-9"
                      disabled={confirming}
                      onClick={() => handleClickConfirmAppointment(appointment.id, false)}
                    >
                      <X />
                    </Button>
                  </div>
                )
              }
            </Card>
          );
        })
      ) : (
        <p>No upcoming appointments</p>
      )}
    </div>
  );
};

export default AppointmentList;