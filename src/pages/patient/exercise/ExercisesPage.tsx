import { MOCK_PATIENT_EXERCISES } from "@/constants"
import ExerciseCard from "./components/ExerciseCard"
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { apiCaller } from "@/utils";
import SkeletonCard from "@/components/SkeletonCard";
import { PatientExercise } from "@/interfaces/exercise";

const ExercisesPage = () => {
  const { isLoading, withLoading } = useLoading();
  const [patientExercises, setPatientExercises] = useState<PatientExercise[]>([]);

  const getData = async () => {
    const MOCK_PATIENT_ID = "5b6a2166-a05e-423a-bf62-00e556543477";
    const res = await apiCaller.get(`patients/${MOCK_PATIENT_ID}/exercises`);
    setPatientExercises(res.data.data);
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
              patientExercises
                .map((patientExercise) => (
                  <ExerciseCard
                    key={patientExercise.id}
                    id={patientExercise.id}
                    title={patientExercise.exercise.title}
                    description={patientExercise.exercise.description}
                    thumbnailUrl={patientExercise.exercise.thumnbailUrl}
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

export default ExercisesPage