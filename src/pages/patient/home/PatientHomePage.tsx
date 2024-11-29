import ExerciseCard from "../exercise/components/ExerciseCard";
import { Card } from "@/components/ui/card";
import { Dumbbell, Newspaper } from "lucide-react";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { DailyPatientExercise } from "@/interfaces/exercise";
import SkeletonCard from "@/components/SkeletonCard";
import { getDailyPatientExercises } from "@/services/patientExercise.service";
import { getCurrentUser } from "@/services/auth.service";
import NumberTicker from "@/components/ui/number-ticker";
import {
  getAllAssessmentsByPatientId,
  PatientAssessment,
} from "@/services/assessment.service";
import AssessmentCard from "../components/AssessmentCard";

const PatientHomePage = () => {
  const { isLoading, withLoading } = useLoading();
  const [dailyPatientExercises, setDailyPatientExercises] = useState<
    DailyPatientExercise[]
  >([]);

  const [patientAssessment, setPatientAssessment] = useState<
    PatientAssessment[]
  >([]);

  const currentUser = getCurrentUser();

  const getData = async () => {
    if (!currentUser) return;

    const data = await getDailyPatientExercises(currentUser.id);
    setDailyPatientExercises(data);

    const assessment = await getAllAssessmentsByPatientId(currentUser.id);

    const filterAssessmentByStatus = assessment.filter(
      (assessment) => assessment.status !== "Completed"
    );
    if (filterAssessmentByStatus.length > 0)
      setPatientAssessment(filterAssessmentByStatus);
  };

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[40rem] w-full mx-auto">
      <h1>Welcome Back, {getCurrentUser()?.fullname}</h1>
      <div className="flex items-center justify-normal md:justify-around flex-col md:flex-row  gap-6">
        <Card
          className="p-4 flex flex-col items-center h-40 shadow-lg cursor-pointer w-full md:w-auto"
          onClick={(e) => {
            e.preventDefault();
            window.location.replace("/#pending-exercises");
          }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 size-9 rounded-full flex items-center justify-center">
              <Dumbbell className="text-primary size-5" />
            </div>
            <h4 className="">Pending Exercises:</h4>
          </div>
          {dailyPatientExercises.length > 0 ? (
            <NumberTicker
              value={dailyPatientExercises.length}
              className="text-6xl font-bold my-auto"
            />
          ) : (
            <p className="text-6xl font-bold my-auto">0</p>
          )}
        </Card>
        <Card
          className="p-4 flex flex-col items-center h-40 shadow-lg cursor-pointer w-full md:w-auto"
          onClick={(e) => {
            e.preventDefault();
            window.location.replace("/#pending-assessments");
          }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-purple-500/10 size-9 rounded-full flex items-center justify-center">
              <Newspaper className="text-purple-500 size-5" />
            </div>
            <h4 className="">Pending Assessments:</h4>
          </div>
          {patientAssessment.length > 0 ? (
            <NumberTicker
              value={patientAssessment.length}
              className="text-6xl font-bold my-auto"
            />
          ) : (
            <p className="text-6xl font-bold my-auto">0</p>
          )}
        </Card>
      </div>
      <section className="flex flex-col gap-4" id="pending-exercises">
        {dailyPatientExercises.length > 0 ? (
          <div className="flex items-center gap-3">
            <h3>
              Your pending exercises for today ({dailyPatientExercises.length})
            </h3>
          </div>
        ) : (
          <h3>Congrats, you completed all the exercises for today!</h3>
        )}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <div className="flex flex-wrap gap-4">
            {dailyPatientExercises
              .filter(
                (dailyPatientExercise) => !dailyPatientExercise.isCompleted
              ) // Filter out completed exercises
              .map((dailyPatientExercise) => (
                <ExerciseCard
                  key={dailyPatientExercise.id}
                  id={dailyPatientExercise.id}
                  title={dailyPatientExercise.patientExercise.exercise.title}
                  description={
                    dailyPatientExercise.patientExercise.exercise.description
                  }
                  thumbnailUrl={
                    dailyPatientExercise.patientExercise.exercise.thumbnailUrl
                  }
                  isCompleted={dailyPatientExercise.isCompleted}
                  to={`exercises/${dailyPatientExercise.patientExercise.id}`}
                />
              ))}
          </div>
        )}
      </section>
      <section className="flex flex-col gap-4" id="pending-assessments">
        {patientAssessment.length > 0 ? (
          <div className="flex items-center gap-3">
            <h3>Your pending assessment ({patientAssessment.length})</h3>
          </div>
        ) : (
          <h3>Congrats, you completed all the assessments assigned to you!</h3>
        )}
        <div className="flex gap-4">
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <div className="flex flex-wrap gap-4">
              {patientAssessment
                .map((assessment, index) => (
                  <AssessmentCard key={index} assessment={assessment} />
                ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default PatientHomePage;
