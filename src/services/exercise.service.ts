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

export const getExerciseById = async (id: string): Promise<Exercise> => {
  try {
    const res = await apiCaller.get(`exercises/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

interface ExerciseDTO {
  id?: string;
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
}: ExerciseDTO) => {
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

export const updateExercise = async ({
  id,
  title,
  description,
  difficulty,
  content,
  videoUrl,
}: ExerciseDTO) => {
  try {
    const res = await apiCaller.put(`exercises/${id}`, {
      id,
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

export const deleteExerciseById = async (id: string) => {
  try {
    const res = await apiCaller.delete(`exercises/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};