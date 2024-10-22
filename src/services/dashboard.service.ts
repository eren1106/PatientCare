import { User, PatientRecord, PatientTable } from "@/interfaces/dashboard";
import { apiCaller } from "@/utils";
import { getCurrentUser } from "./auth.service";

export const getAllPatient = async (): Promise<User[]> => {
  try {
    const userId = getCurrentUser()?.id;
    const res = await apiCaller.get(`dashboard/${userId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getPatientRecord = async (): Promise<PatientTable[]> => {
  try {
    const userId = getCurrentUser()?.id;
    const res = await apiCaller.get(`dashboard/doctors/${userId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getPatientRecordDetails = async (patientRecordId: string): Promise<PatientRecord> => {
  try {
    const res = await apiCaller.get(`dashboard/records/${patientRecordId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const insertPatientRecord = async (patientRecord: CreatePatientRecord) => {
    try {
      const userId = getCurrentUser()?.id;
      const res = await apiCaller.post(`dashboard/doctors/${userId}`, { patientRecord });
      console.log(res.data.data);
      return res.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
};

export const updatePatientRecord = async (record: PatientRecord | null) => {
  try {
    
    const res = await apiCaller.put(`dashboard/records`,record);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deletePatientRecord = async (patientRecordId: string) => {
  try {
    const res = await apiCaller.put(`dashboard/doctors/deleterecords/${patientRecordId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const createInjury = async (injuryData: CreateInjury): Promise<Injury> => {
  try {
    const res = await apiCaller.post('dashboard/injury', injuryData);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};


export const updateInjury = async (injuryId: string, injuryData: Partial<Injury>) => {
  try {
    const res = await apiCaller.put(`dashboard/injury/${injuryId}`, injuryData);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Service to delete an injury
export const deleteInjury = async (injuryId: string) => {
  try {
    const res = await apiCaller.delete(`dashboard/injury/${injuryId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export interface CreatePatientRecord {
  patientId:string
  weight:number,
  height:number,
  injury: Injury[];
}

export interface Injury {
  id : string
  painRegion: string;
  duration: string;
  painScore: number;
  is_recurrent: "YES" | "NO" | undefined;
  description: string;
}

export interface CreateInjury {
  patientRecordId : string;
  painRegion: string;
  duration: string;
  painScore: number;
  is_recurrent: "YES" | "NO" | undefined;
  description: string;
}


