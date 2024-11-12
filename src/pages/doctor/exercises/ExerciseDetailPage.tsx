import Spinner from '@/components/Spinner';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import useLoading from '@/hooks/useLoading.hook';
import { Exercise } from '@/interfaces/exercise';
import ExerciseDetailsComponent from '@/pages/exercise/components/ExerciseDetailsComponent';
import { getExerciseById } from '@/services/exercise.service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExerciseDetailPage = () => {
  const { id } = useParams();

  const { isLoading, withLoading } = useLoading();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  const getData = async () => {
    if (id) {
      const data = await getExerciseById(id);
      setExercise(data);
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  return (
    <>
      <ExerciseDetailsComponent
        isLoading={isLoading}
        exercise={exercise!}
      />
    </>
  )
}

export default ExerciseDetailPage