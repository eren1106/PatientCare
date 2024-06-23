import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import useLoading from "@/hooks/useLoading.hook";
import { DailyPatientExercise } from "@/interfaces/exercise";
import { completePatientExercise, getDailyPatientExerciseById } from "@/services/patientExercise.service";
import { refreshPage } from "@/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PatientExerciseDetailPage = () => {
  const { id } = useParams();

  const { isLoading, withLoading } = useLoading();
  const [dailyPatientExercise, setDailyPatientExercise] = useState<DailyPatientExercise | null>(null);

  const getData = async () => {
    if (id) {
      const data = await getDailyPatientExerciseById(id);
      setDailyPatientExercise(data);
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const handleMarkComplete = async () => {
    if (!id) return;
    try {
      await completePatientExercise(id);
      toast({
        title: "Marked as complete!",
        description: "Congrats on completing this exercise for today!",
        variant: "success"
      });

      refreshPage();
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
    <>
      {
        isLoading ? <Spinner /> : (
          <div className="flex flex-col gap-4">
            <h1>{dailyPatientExercise?.patientExercise.exercise.title}</h1>
            <p>{dailyPatientExercise?.patientExercise.exercise.description}</p>
            {dailyPatientExercise?.patientExercise.exercise.videoUrl && <YouTubeEmbed url={dailyPatientExercise.patientExercise.exercise.videoUrl} />}
            <p>{dailyPatientExercise?.patientExercise.exercise.content}</p>
            {
              dailyPatientExercise?.isCompleted
                ? <p className="text-lg font-bold text-primary">You had completed this exercise for today!</p>
                : <Button onClick={handleMarkComplete} className="w-min">Mark as complete</Button>
            }
          </div>
        )
      }
    </>
  )
}

export default PatientExerciseDetailPage