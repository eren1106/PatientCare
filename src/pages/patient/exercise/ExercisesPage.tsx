import { MOCK_PATIENT_EXERCISES } from "@/constants"
import ExerciseCard from "./components/ExerciseCard"
import useLoading from "@/hooks/useLoading.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { apiCaller } from "@/utils";

const ExercisesPage = () => {
  const { isLoading, withLoading } = useLoading();

  const getData = async () => {
    const MOCK_PATIENT_ID = "5b6a2166-a05e-423a-bf62-00e556543477";
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises`);
    console.log("DATA: ", res.data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1>Exercises that are assigned to you</h1>
      {
        isLoading ? <Skeleton /> : (
          <div className="flex flex-wrap gap-4">
            {
              MOCK_PATIENT_EXERCISES.map((patientExercise) => (
                <ExerciseCard
                  key={patientExercise.id}
                  id={patientExercise.id}
                  title={patientExercise.exercise.title}
                  description={patientExercise.exercise.description}
                  thumbnailUrl={patientExercise.exercise.thumnbailUrl}
                  isCompleted={patientExercise.isCompleted}
                />
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default ExercisesPage