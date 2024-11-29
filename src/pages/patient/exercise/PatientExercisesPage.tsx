import ExerciseCard from "./components/ExerciseCard"
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import SkeletonCard from "@/components/SkeletonCard";
import { DailyPatientExercise } from "@/interfaces/exercise";
import { getDailyPatientExercises } from "@/services/patientExercise.service";
import { getCurrentUser } from "@/services/auth.service";

const PatientExercisesPage = () => {
  const { isLoading, withLoading } = useLoading();
  const [dailyPatientExercises, setDailyPatientExercises] = useState<DailyPatientExercise[]>([]);

  const patientId = getCurrentUser()?.id;
  const getData = async () => {
    if (!patientId) return;
    const data = await getDailyPatientExercises(patientId);
    setDailyPatientExercises(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-[40rem] w-full mx-auto">
      <h2>Exercises that are assigned to you</h2>
      {
        isLoading ? <SkeletonCard /> : (
          <div className="flex flex-wrap gap-4">
            {
              dailyPatientExercises.length > 0 ? dailyPatientExercises
                .map((dailyPatientExercise) => (
                  <ExerciseCard
                    key={dailyPatientExercise.id}
                    id={dailyPatientExercise.id}
                    title={dailyPatientExercise.patientExercise.exercise.title}
                    description={dailyPatientExercise.patientExercise.exercise.description}
                    thumbnailUrl={dailyPatientExercise.patientExercise.exercise.thumbnailUrl}
                    isCompleted={dailyPatientExercise.isCompleted}
                    to={`/exercises/${dailyPatientExercise.patientExercise.id}`}
                  />
                )) : <p>You have no exercises assigned to you</p>
            }
          </div>
        )
      }
    </div>
  )
}

export default PatientExercisesPage