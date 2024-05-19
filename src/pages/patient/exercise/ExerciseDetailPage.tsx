import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { MOCK_PATIENT_EXERCISES } from "@/constants"

const ExerciseDetailPage = () => {
  const patientExercise = MOCK_PATIENT_EXERCISES[0];
  const handleMarkComplete = () => {};

  return (
    <div className="flex flex-col gap-4">
      <h1>{patientExercise.exercise.title}</h1>
      <p>{patientExercise.exercise.description}</p>
      <YouTubeEmbed url={patientExercise.exercise.videoUrl} />
      <p>{patientExercise.exercise.content}</p>
      {
        patientExercise.isCompleted
          ? <p>Completed</p>
          : <Button onClick={handleMarkComplete} className="w-min">Mark as complete</Button>
      }
    </div>
  )
}

export default ExerciseDetailPage