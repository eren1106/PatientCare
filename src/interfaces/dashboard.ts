
export interface User {
    id: string;
    username: string;
    ic : string;
    fullname: string;
    age : string;
    gender : string;
    email: string;
    profileImageUrl: string;
    createdDatetime: string;
    updatedDatetime: string;
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
    doctor_id:string,
    patientId:string,
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



export const createDefaultPatientRecord = (): PatientRecord => {
    const defaultUser: User = {
        id: '',
        username: '',
        ic: '',
        fullname: '',
        age: '',
        gender: '',
        email: '',
        profileImageUrl: '',
        createdDatetime: new Date().toISOString(),
        updatedDatetime: new Date().toISOString(),
    };

    return {
        id: '',
        doctor_id: '',
        patientId: '',
        weight: 0,
        height: 0,
        progressReport: '',
        createdDatetime: new Date(),
        updatedDatetime: new Date(),
        doctor: defaultUser,
        patient: defaultUser,
        appointment: [],
        exercise: [],
        assessment: [],
        injuries: [],
    };
};