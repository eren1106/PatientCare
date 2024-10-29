import React, { useState, useEffect } from "react";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DynamicDialogTrigger from "@/components/DynamicDialogTrigger";
import AppointmentForm from "./components/AppointmentForm";
import { Appointment } from "@/interfaces/appointment";
import { getAppointmentsByUserId } from "@/services/appointment.service";
import { getCurrentUser } from "@/services/auth.service";
import { formatTime } from "@/utils";
import AppointmentList from "@/components/appointment/AppointmentList";
import useLoading from "@/hooks/useLoading.hook";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AppointmentPageProps {
  isDoctor?: boolean
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ isDoctor = true }) => {
  const { isLoading, withLoading } = useLoading();
  const currentUser = getCurrentUser();

  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchData = async () => {
    if (!currentUser) return;

    const fetchedAppointments = await getAppointmentsByUserId(currentUser.id);

    // Map the fetched appointments to FullCalendar's event format
    const events: EventInput[] = fetchedAppointments.map(
      (appointment: Appointment) => ({
        id: appointment.id,
        title: appointment.title,
        start: appointment.startTime,
        end: appointment.endTime,
        description: appointment.description,
        allDay: false, // Assuming your appointments are not all-day events
      })
    );

    setAppointments(fetchedAppointments);
    setCurrentEvents(events); // Update the current events state with mapped events
  };

  useEffect(() => {
    withLoading(fetchData);
  }, []);

  const handleClickCreateppointment = () => {
    setSelectedDate(new Date());
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  }

  const handleDateClick = (selected: DateSelectArg) => {
    // FOR CREATE APPOINTMENT
    if (!isDoctor) return;
    setSelectedDate(selected.start); // for setting default date value for CREATE form
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    // FOR UPDATE APPOINTMENT
    if (!isDoctor) return;
    const appointment = appointments.find((a) => a.id === selected.event.id);
    if (!appointment) return;
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleAppointmentCardClick = (appointment: Appointment) => {
    if (!isDoctor) return;
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  }

  if (isLoading) return <Spinner />
  return (
    <div className="flex flex-col gap-6">
      {
        isDoctor && (
          <Button
            onClick={handleClickCreateppointment}
            className="w-fit"
          >
            <Plus size={20} className="mr-3" />
            Add Appointment
          </Button>
        )
      }
      <div className="w-full overflow-x-auto">
        <div className="min-w-[40rem]">
          <FullCalendar
            // height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              right: "dayGridMonth,timeGridDay",
            }}
            initialView="dayGridMonth"
            // editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents} // Load events from state (mapped appointments)
            eventContent={(eventInfo) => (
              <div className="h-full w-full flex flex-col gap-2 bg-primary text-primary-foreground p-2 rounded-md">
                <b>{eventInfo.event.title}</b>
                {
                  eventInfo.event.start && eventInfo.event.end &&
                  <p className="text-xs">{`${formatTime(eventInfo.event.start)} - ${formatTime(eventInfo.event.end)}`}</p>
                }
              </div>
            )}
          />
        </div>
      </div>

      <AppointmentList
        appointments={appointments}
        onClick={handleAppointmentCardClick}
        isDoctor={isDoctor}
      />

      {/* APPOINTMENT DIALOG */}
      <DynamicDialogTrigger
        title={`${selectedAppointment?.id ? "Edit" : "Create"} Appointment`}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        content={
          <AppointmentForm
            appointmentId={selectedAppointment?.id}
            defaultValues={selectedAppointment ? {
              ...selectedAppointment,
              date: new Date(selectedAppointment.date),
              startTime: new Date(selectedAppointment.startTime),
              endTime: new Date(selectedAppointment.endTime),
            } : undefined}
            selectedDate={selectedDate ?? undefined}
          />}
      />
    </div>
  );
};

export default AppointmentPage;
