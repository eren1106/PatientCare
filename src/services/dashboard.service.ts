import { User, PatientRecord, PatientTable } from "@/interfaces/dashboard";
import { apiCaller } from "@/utils";

const MOCK_DOCTOR_ID = "clx71vp0x00039gzgzbreeuxm";

export const getAllPatient = async (): Promise<User[]> => {
  try {
    const res = await apiCaller.get(`dashboard/${MOCK_DOCTOR_ID}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getPatientRecord = async (): Promise<PatientTable[]> => {
  try {
    const res = await apiCaller.get(`dashboard/doctors/${MOCK_DOCTOR_ID}`);
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
      console.log(patientRecord);
      const res = await apiCaller.post(`dashboard/doctors/${MOCK_DOCTOR_ID}`, { patientRecord });
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


