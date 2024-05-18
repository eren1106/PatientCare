import { MOCK_PATIENT_EXERCISES } from "@/constants"
import ExerciseCard from "./components/ExerciseCard"

const ExercisesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1>Exercises that are assigned to you</h1>
      <div className="flex flex-wrap gap-4">
        {
          MOCK_PATIENT_EXERCISES.map((exercise) => (
            <ExerciseCard
              id={exercise.id}
              title={exercise.exercise.title}
              description={exercise.exercise.description}
              thumbnailUrl={exercise.exercise.thumnbailUrl}
              isCompleted={exercise.isCompleted}
            />
          ))
        }
      </div>
    </div>
  )
}

export default ExercisesPage