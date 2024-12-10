import AssessmentScoreGraph from "./components/AssessmentScoreGraph"
import ExerciseCompletionGraph from "./components/ExerciseCompletionGraph"

const DoctorTrackingPage = () => {
  return (
    <div>
      <ExerciseCompletionGraph />
      <AssessmentScoreGraph />
    </div>
  )
}

export default DoctorTrackingPage