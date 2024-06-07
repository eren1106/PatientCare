import ExerciseCard from "./components/ExerciseCard"
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import SkeletonCard from "@/components/SkeletonCard";
import { DailyPatientExercise } from "@/interfaces/exercise";
import { getDailyPatientExercises } from "@/services/patientExercise.service";

const PatientExercisesPage = () => {
  const { isLoading, withLoading } = useLoading();
  const [dailyPatientExercises, setDailyPatientExercises] = useState<DailyPatientExercise[]>([]);

  const getData = async () => {
    const data = await getDailyPatientExercises();
    setDailyPatientExercises(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1>Exercises that are assigned to you</h1>
      {
        isLoading ? <SkeletonCard /> : (
          <div className="flex flex-wrap gap-4">
            {
              dailyPatientExercises
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
                ))
            }
          </div>
        )
      }
    </div>
  )
}

export default PatientExercisesPage