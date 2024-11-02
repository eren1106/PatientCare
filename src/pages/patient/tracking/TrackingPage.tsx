import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import {
  EventInput,
} from "@fullcalendar/core";
import { CircleCheckBig, CircleX, X } from "lucide-react";
import { checkIsToday } from "@/utils";

const MOCK_EVENTS: EventInput[] = [
  {
    title: "Event 1",
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    description: "Event 1 description",
    allDay: true,
    extendedProps: {
      completedExercise: 2,
      totalExercise: 3,
    }
  },
  {
    title: "Event 2",
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    description: "Event 2 description",
    allDay: true,
    extendedProps: {
      completedExercise: 3,
      totalExercise: 3,
    }
  },
  {
    title: "Event 3",
    start: new Date(),
    description: "Event 3 description",
    allDay: true,
    extendedProps: {
      completedExercise: 1,
      totalExercise: 3,
    }
  },
]
const TrackingPage = () => {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>(MOCK_EVENTS);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "",
        }}
        initialView="dayGridMonth"
        // editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        // select={handleDateClick}
        // eventClick={handleEventClick}
        events={currentEvents}
        eventColor="transparent"
        eventClick={(info) => {
          // TODO: Open modal to show which exercise is completed & which is not
        }}
        eventContent={(eventInfo) => {
          const completedExercise = eventInfo.event.extendedProps.completedExercise;
          const totalExercise = eventInfo.event.extendedProps.totalExercise;
          const isCompleted = completedExercise === totalExercise;
          const isToday = checkIsToday(eventInfo.event.start!);

          return (
            <div className="h-full w-full flex flex-col items-center justify-center text-foreground hover:bg-muted rounded-md cursor-pointer">
              {
                isToday ? 
                  <p className="text-muted-foreground font-medium">Today's Progress:</p>
                :
                  isCompleted ?
                    <CircleCheckBig className="text-green-500 size-12" />
                  :
                    <X className="text-destructive size-12" />
              }
              <p className={`${
                isToday 
                  ? "text-muted-foreground" 
                  : isCompleted 
                    ? "text-green-500" 
                    : "text-destructive"
              } text-lg`}>
                {`${completedExercise} / ${totalExercise}`}
              </p>
            </div>
          )
        }}
      />
    </div>
  )
}

export default TrackingPage