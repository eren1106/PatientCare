import { toast } from "@/components/ui/use-toast";
import useLoading from "@/hooks/useLoading.hook";
import { DailyPatientExercise, PatientExercise } from "@/interfaces/exercise";
import ExerciseDetailsComponent from "@/pages/exercise/components/ExerciseDetailsComponent";
import { completePatientExercise, getDailyPatientExerciseById, getPatientExerciseById } from "@/services/patientExercise.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PatientExerciseDetailPage = () => {
  const { id } = useParams();

  const { isLoading, withLoading } = useLoading();
  const [dailyPatientExercise, setDailyPatientExercise] = useState<DailyPatientExercise | null>(null);
  const [patientExercise, setPatientExercise] = useState<PatientExercise | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const getData = async () => {
    try {
      if (id) {
        // const data = await getDailyPatientExerciseById(id);
        // setDailyPatientExercise(data);
        // setIsCompleted(data.isCompleted);
        const fetchedPatientExercise = await getPatientExerciseById(id);
        const fetchedDailyPatientExercise = await getDailyPatientExerciseById(fetchedPatientExercise.id);
        setPatientExercise(fetchedPatientExercise);
        setDailyPatientExercise(fetchedDailyPatientExercise);
        setIsCompleted(fetchedDailyPatientExercise.isCompleted);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const handleMarkComplete = async () => {
    if (!dailyPatientExercise) return;
    try {
      await completePatientExercise(dailyPatientExercise.id);
      setIsCompleted(true);

      toast({
        title: "Marked as complete!",
        description: "Congrats on completing this exercise for today!",
        variant: "success"
      });

      // refreshPage();
    }
    catch (e) {
      console.error(e);
      toast({
        title: "Failed",
        description: "Something went wrong!",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="max-w-[50rem] w-full mx-auto">
      <ExerciseDetailsComponent
        isLoading={isLoading}
        exercise={patientExercise?.exercise!}
        dailyPatientExercise={dailyPatientExercise!}
        handleMarkComplete={handleMarkComplete}
        isCompleted={isCompleted}
      />
    </div>
  )
}

export default PatientExerciseDetailPage