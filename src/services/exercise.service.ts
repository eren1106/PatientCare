import { Exercise } from "@/interfaces/exercise";
import { apiCaller } from "@/utils";

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const res = await apiCaller.get(`exercises`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface CreateExerciseDTO {
  title: string,
  description: string,
  difficulty: string,
  content: string,
  videoUrl: string,
}

export const createExercise = async ({
  title,
  description,
  difficulty,
  content,
  videoUrl,
}: CreateExerciseDTO) => {
  try {
    const res = await apiCaller.post(`exercises`, {
      title,
      description,
      difficulty,
      content,
      videoUrl,
    });
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};