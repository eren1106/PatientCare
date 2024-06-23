import { Gender } from "@/enums/gender.enum";
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
}

export interface Patient extends User {
  patientRecord: PatientRecord;
  patientExercise: PatientExercise[];
}