import { Patient } from "@/interfaces/dashboard";
import { apiCaller } from "@/utils";

export const getProfileById = async (id: string): Promise<Patient> => {
  try {
    // const MOCK_PATIENT_ID = "clx71vozt00029gzgr9me5ixn"
    const res = await apiCaller.get(`profile/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};