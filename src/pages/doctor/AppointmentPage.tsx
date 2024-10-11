import React, { useState, useEffect } from "react";
import {
  formatDate,
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
import { getAppointmentsByDoctorId } from "@/services/appointment.service";
import { getCurrentUser } from "@/services/auth.service";
import { formatTime } from "@/utils";

const Calendar: React.FC = () => {
  const currentUser = getCurrentUser();

  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchData = async () => {
    if (!currentUser) return;

    const fetchedAppointments = await getAppointmentsByDoctorId(currentUser.id);

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

    // setAppointments(fetchedAppointments);
    setCurrentEvents(events); // Update the current events state with mapped events
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateClick = (selected: DateSelectArg) => {
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete the event "${selected.event.title}"?`)) {
      selected.event.remove();
    }
  };

  return (
    <div>
      <div className="mt-8">
        <FullCalendar
          // height={"85vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventClick={handleEventClick}
          events={currentEvents} // Load events from state (mapped appointments)
          eventContent={(eventInfo) => (
            <div className="h-full w-full flex flex-col gap-2 bg-primary text-primary-foreground p-2 m-1 rounded-md">
              <b>{eventInfo.event.title}</b>
              {
                eventInfo.event.start && eventInfo.event.end &&
                <p className="text-xs">{`${formatTime(eventInfo.event.start)} - ${formatTime(eventInfo.event.end)}`}</p>
              }
            </div>
          )}
        />
      </div>

      {/* APPOINTMENT DIALOG */}
      <DynamicDialogTrigger
        title="Add New Appointment"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        content={<AppointmentForm />}
      />
    </div>
  );
};

export default Calendar;
