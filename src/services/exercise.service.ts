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