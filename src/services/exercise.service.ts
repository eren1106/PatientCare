import { Exercise } from "@/interfaces/exercise";
import { apiRequest } from "@/utils/apiRequest";

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const res = await apiRequest.get(`exercises`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  try {
    const res = await apiRequest.get(`exercises/${id}`);
    return res.data;
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
    const res = await apiRequest.post(`exercises`, {
      title,
      description,
      difficulty,
      content,
      videoUrl,
    });
    return res.data;
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
    const res = await apiRequest.put(`exercises/${id}`, {
      id,
      title,
      description,
      difficulty,
      content,
      videoUrl,
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteExerciseById = async (id: string) => {
  try {
    const res = await apiRequest.delete(`exercises/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAllExerciseCategories = async () => {
  try {
    const res = await apiRequest.get(`exercises/exercise-categories`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

interface ExerciseCategoryDTO {
  id?: string;
  title: string;
  description: string;
}

export const createExerciseCategory = async (data: ExerciseCategoryDTO) => {
  try {
    const res = await apiRequest.post(`exercises/exercise-categories`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const updateExerciseCategory = async (data: ExerciseCategoryDTO) => {
  try {
    const res = await apiRequest.put(`exercises/exercise-categories/${data.id}`, data);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const deleteExerciseCategory = async (id: string) => {
  try {
    const res = await apiRequest.delete(`exercises/exercise-categories/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}