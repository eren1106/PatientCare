import { PatientExercise } from "./exercise";

export interface User {
    id: string;
    username: string;
    fullname: string;
    email: string;
    profileImageUrl: string | null;
    createdDatetime: string;
}

export interface PatientTable {
    id:string,
    doctor_id:string,
    patient_id:string,
    appointment: Appointment[],
    patient: User
}

export interface PatientRecord {
    id:string;
    docotr_id:string,
    patientId:string,
    ic_no:string,
    age: number,
    gender: 'MALE' | 'FEMALE',
    weight: number,
    height: number,
    progressReport: string,
    createdDatetime: Date,
    updatedDatetime: Date,
    doctor: User,
    patient: User,
    appointment: Appointment[],
    exercise: Exercise[],
    assessment: Assessment[],
    injuries: Injury[]
}

export interface Exercise {

}

export interface Appointment {
    id: string,
    title: string,
    description: string,
    scheduledDatetime: Date,
    doctorId: string,
    patientId: string,
    createdDatetime: Date | null,
    updatedDatetime: Date | null
}

export interface Assessment {
    id: string,
    userId: string,
    questionnaireId:string,
    patientRecordId:string,
    createdDatetime: Date | null,
}

export interface Injury {
    id:string,
    patientRecordId:string,
    painRegion:string,
    duration:string,
    painScore:number,
    description:string,
    is_recurrent: 'YES' | 'NO',
    createdDatetime: Date | null,
    updatedDatetime: Date | null
}

export interface CreatePatientRecord {
    patientId:string
    ic_no:string,
    age:number,
    gender:string,
    weight:number,
    height:number,
}