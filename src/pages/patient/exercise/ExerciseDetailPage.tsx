import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { MOCK_DAILY_PATIENT_EXERCISES } from "@/constants"

const ExerciseDetailPage = () => {
  const dailyPatientExercise = MOCK_DAILY_PATIENT_EXERCISES[0];
  const handleMarkComplete = () => { };

  return (
    <div className="flex flex-col gap-4">
      <h1>{dailyPatientExercise.patientExercise.exercise.title}</h1>
      <p>{dailyPatientExercise.patientExercise.exercise.description}</p>
      {dailyPatientExercise.patientExercise.exercise.videoUrl && <YouTubeEmbed url={dailyPatientExercise.patientExercise.exercise.videoUrl} />}
      <p>{dailyPatientExercise.patientExercise.exercise.content}</p>
      {
        dailyPatientExercise.isCompleted
          ? <p>Completed</p>
          : <Button onClick={handleMarkComplete} className="w-min">Mark as complete</Button>
      }
    </div>
  )
}

export default ExerciseDetailPage