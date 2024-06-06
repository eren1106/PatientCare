import DialogButton from "@/components/DialogButton";
import { MOCK_EXERCISES } from "@/constants"
import ExerciseForm from "./exercises/components/ExerciseForm";
import ExercisesTable from "./exercises/components/ExercisesTable";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { Exercise } from "@/interfaces/exercise";
import { getExercises } from "@/services/exercise.service";

const ExercisesPage = () => {
  const { isLoading, withLoading } = useLoading();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const getData = async () => {
    const data = await getExercises();
    setExercises(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <div>
      <div className="border border-gray-300 rounded-lg p-5 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Exercises</span>
          <DialogButton
            variant="default"
            title="Create Exercise"
            content={
              <div className="flex flex-col gap-3">
                <ExerciseForm />
              </div>
            }>Create Exercise</DialogButton>
        </div>

        <ExercisesTable
          exercises={exercises}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default ExercisesPage