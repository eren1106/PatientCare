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
      <h1>Exercises that are assigned to you</h1>
      {
        isLoading ? <SkeletonCard /> : (
          <div className="flex flex-wrap gap-4">
            {
              dailyPatientExercises.length > 0 ? dailyPatientExercises
                .map((patientExercise) => (
                  <ExerciseCard
                    key={patientExercise.id}
                    id={patientExercise.id}
                    title={patientExercise.patientExercise.exercise.title}
                    description={patientExercise.patientExercise.exercise.description}
                    thumbnailUrl={patientExercise.patientExercise.exercise.thumbnailUrl}
                    isCompleted={patientExercise.isCompleted}
                    to={`${patientExercise.id}`}
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