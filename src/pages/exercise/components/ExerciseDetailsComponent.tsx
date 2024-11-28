import SkeletonCard from '@/components/SkeletonCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfettiButton } from '@/components/ui/confetti';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { DailyPatientExercise, Exercise, PatientExercise } from '@/interfaces/exercise'
import { convertEnumToTitleCase } from '@/utils';
import { CircleCheckBig } from 'lucide-react';

interface ExerciseDetailsComponentProps {
  isLoading: boolean;
  exercise: Exercise;
  patientExercise?: PatientExercise;
  dailyPatientExercise?: DailyPatientExercise;
  handleMarkComplete?: () => Promise<void>;
  isCompleted?: boolean;
}

const ExerciseDetailsComponent = (props: ExerciseDetailsComponentProps) => {
  return (
    <Card className='shadow-md p-6 flex flex-col gap-4'>
      {
        props.isLoading || !props.exercise ? <SkeletonCard /> : (
          <div className="flex flex-col gap-4 w-full">
            <h1>{props.exercise.title}</h1>
            <p>{props.exercise.description}</p>
            {
              props.exercise.videoUrl
              && (
                <div className="md:max-w-[50rem] w-full">
                  <YouTubeEmbed
                    url={props.exercise.videoUrl}
                    wrapperClassName="rounded-xl overflow-hidden"
                  />
                </div>
              )
            }
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <Badge variant="secondary" className='w-fit'>{props.exercise.exerciseCategory.title}</Badge>
                <Badge variant="secondary">{convertEnumToTitleCase(props.exercise.difficulty)}</Badge>
              </div>
              <p>{props.exercise.content}</p>

              {
                props.dailyPatientExercise && (
                  <div>
                    <h4>Your exercise specifications:</h4>
                    {props.patientExercise && (
                      <>
                        <p>Reps: {props.patientExercise.reps}</p>
                        <p>Sets: {props.patientExercise.sets}</p>
                        <p>Frequency: {props.patientExercise.frequency}</p>
                        <p>Duration: {props.patientExercise.duration}</p>
                      </>
                    )}
                  </div>
                )
              }

              {
                props.dailyPatientExercise && (
                  <div className='flex flex-col items-center'>
                    {
                      props.isCompleted
                        ? <p className="text-lg font-bold text-green-500">You had completed this exercise for today!</p>
                        : <div className='relative'>
                          <ConfettiButton
                            onClick={props.handleMarkComplete}
                            className='flex items-center gap-2 text-lg'
                            size="lg"
                          >Mark as complete <CircleCheckBig />
                          </ConfettiButton>
                        </div>
                    }
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </Card>
  )
}

export default ExerciseDetailsComponent