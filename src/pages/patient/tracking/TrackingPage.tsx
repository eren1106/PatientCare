import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import {
  EventInput,
} from "@fullcalendar/core";
import { CircleCheckBig, CircleDashed, X } from "lucide-react";
import { checkIsToday } from "@/utils";
import DynamicDialogTrigger from "@/components/DynamicDialogTrigger";
import { DailyPatientExercise } from "@/interfaces/exercise";
import { getAllTimeDailyPatientExercises } from "@/services/patientExercise.service";
import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/services/auth.service";

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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [dailyPatientExercises, setDailyPatientExercises] = useState<DailyPatientExercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const currentUser = getCurrentUser();

  const fetchData = async () => {
    if(!currentUser) return;
    
    setIsLoading(true);
    try {
      const data = await getAllTimeDailyPatientExercises(currentUser?.id);
      // group daily patient exercises by date and convert into event input
      const groupedExercises = data.reduce((acc: { [key: string]: DailyPatientExercise[] }, exercise) => {
        const date = new Date(exercise.createdDatetime).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(exercise);
        return acc;
      }, {});

      // Convert grouped exercises to event input format
      const events: EventInput[] = Object.entries(groupedExercises).map(([date, exercises]) => {
        const completedExercises = exercises.filter(ex => ex.isCompleted).length;
        return {
          start: new Date(date),
          allDay: true,
          extendedProps: {
            completedExercise: completedExercises,
            totalExercise: exercises.length,
            exercises: exercises // Store full exercise data for dialog
          }
        };
      });

      setCurrentEvents(events);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="flex flex-col gap-8">
      <h1>Exercise Completion Tracking</h1>
      {
        isLoading ? <Spinner /> : (
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
            // select={handleDateClick}
            // eventClick={handleEventClick}
            dayMaxEventRows={true}
            height="auto" // Make calendar height adapt to content
            events={currentEvents}
            eventColor="transparent"
            eventClick={(info) => {
              setSelectedEvent({
                start: info.event.start || undefined,
                extendedProps: info.event.extendedProps
              });
              setIsDialogOpen(true);
            }}
            eventContent={(eventInfo) => {
              const completedExercise = eventInfo.event.extendedProps.completedExercise;
              const totalExercise = eventInfo.event.extendedProps.totalExercise;
              const isCompleted = completedExercise === totalExercise;
              const isToday = checkIsToday(eventInfo.event.start!);

              return (
                <div className="h-full w-full flex flex-col items-center justify-center text-foreground hover:bg-muted rounded-md cursor-pointer">
                  {
                    isCompleted ?
                      <div className="text-green-500 flex flex-col items-center justify-center">
                        <CircleCheckBig className="size-12" />
                        <p className="font-medium">Completed</p>
                      </div>
                      :
                      isToday ?
                        <p className="font-medium">Today's Progress:</p>
                        :
                        <div className="text-destructive flex flex-col items-center justify-center">
                          <X className="size-12" />
                          <p className="font-medium">Not Completed</p>
                        </div>
                  }
                  <p className={`${isCompleted
                    ? "text-green-500"
                    : isToday
                      ? ""
                      : "text-destructive"
                    } text-lg`}>
                    {`${completedExercise} / ${totalExercise}`}
                  </p>
                </div>
              )
            }}
          />
        )
      }

      {/* COMPLETED EXERCISE DIALOG */}
      <DynamicDialogTrigger
        title={`Completed Exercise (${selectedEvent?.extendedProps?.completedExercise} / ${selectedEvent?.extendedProps?.totalExercise})`}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        content={
          <div className="flex flex-col gap-4">
            {
              selectedEvent?.extendedProps?.exercises.map((dailyPatientExercise: DailyPatientExercise) => (
                <div key={dailyPatientExercise.id} className="flex items-center justify-between">
                  <p>{`${dailyPatientExercise.patientExercise.exercise.title} (${dailyPatientExercise.patientExercise.sets} sets)`}</p>
                  {
                    dailyPatientExercise.isCompleted ? <CircleCheckBig className="text-green-500 size-4" /> : <CircleDashed className="text-muted-foreground size-4" />
                  }
                </div>
              ))
            }
          </div>
        }
      />
    </Card>
  )
}

export default TrackingPage