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
export const DEFAULT_AVATAR_URL = "/images/default_avatar.png";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB limit
export const DEFAULT_ERROR_MESSAGE = "Error Occurred. Please try again later.";