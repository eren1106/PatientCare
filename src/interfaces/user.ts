import { Gender, UserRole } from "@/enums";
import { PatientRecord } from "./dashboard";
import { PatientExercise } from "./exercise";

export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  profileImageUrl: string | null;
  createdDatetime: string;
  age: number;
  gender: Gender;
  ic: string;
  isDelete: boolean;
  role: UserRole;
}

export interface Patient extends User {
  patientRecord: PatientRecord;
  patientExercise: PatientExercise[];
}

export interface Doctor extends User {
  patientRecord: PatientRecord[];
  doctorValidation: DoctorValidation;
}

interface DoctorValidation {
  id: string;
  doctorId: string;
  registrationNumber: string;
  identityImageUrl?: string;
}