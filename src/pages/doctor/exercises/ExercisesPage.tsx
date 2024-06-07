import DialogButton from "@/components/DialogButton";
import ExerciseForm from "./components/ExerciseForm";
import ExercisesTable from "./components/ExercisesTable";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { Exercise } from "@/interfaces/exercise";
import { deleteExerciseById, getExercises } from "@/services/exercise.service";
import { useToast } from "@/components/ui/use-toast";

const ExercisesPage = () => {
  const { toast } = useToast();

  const { isLoading, withLoading } = useLoading();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const getData = async () => {
    const data = await getExercises();
    setExercises(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const handleClickDelete = async (id: string) => {
    try {
      await deleteExerciseById(id);

      toast({
        variant: "success",
        title: "Exercise Deleted Successfully",
      });
    }
    catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e.response.data.message}`,
      });
    }
  }

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
          onDelete={handleClickDelete}
        />
      </div>
    </div>
  )
}

export default ExercisesPage