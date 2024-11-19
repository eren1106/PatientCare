import { SelectItem } from '@/interfaces/select-items';

export * from './mocks'

export const DASHBOARD_ROOT_PATH = "dashboard";
export const EXERCISE_DIFFICULTY: SelectItem[] = [
  {
    label: "Easy",
    value: "EASY",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "Hard",
    value: "HARD",
  },
];

export const GENDER_SELECT: SelectItem[] = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
];

export const USER_SESSION_KEY = "USER_SESSION";
export const APP_LOGO_URL = "/healthcare.png";
export const SOCKET_IO_PATH = "/api/socket.io";
export const DEFAULT_AVATAR_URL = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1722816000&semt=ais_hybrid";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB limit
