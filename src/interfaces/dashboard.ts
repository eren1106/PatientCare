export interface User {
    id: string;
    username: string;
    email: string;
    profileImageUrl: string | null;
    createdDatetime: string;
}


export interface PatientRecord {
    id:string;
    docotr_id:string,
    patient_id:string,
    ic_no:string,
    age: number,
    gender: string,
    weight: string,
    height: string,
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
    is_recurrent:string,
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