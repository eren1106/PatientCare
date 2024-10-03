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

interface CreatePatientRecord {
  patientId:string
  ic_no:string,
  age:number,
  gender:string,
  weight:number,
  height:number,
}


