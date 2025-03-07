import { USER_SESSION_KEY } from "@/constants";
import useCallStore from "@/hooks/useCallStore.hook";
import { User } from "@/interfaces/user";
import { RegisterSchemaType } from "@/schemas/register.schema";
import { apiRequest } from "@/utils/apiRequest";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await apiRequest.post(`auth/login`, {
      email,
      password
    });
    const user = res.data;
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const registerUser = async (data: RegisterSchemaType): Promise<User> => {
  const res = await apiRequest.post(`auth/register`, data);
  return res.data;
}

export const getCurrentUser = (): User | null | undefined => {
  const userString = localStorage.getItem(USER_SESSION_KEY);
  if(!userString) return null;

  const user = JSON.parse(userString);
  return user;
}

export const logoutUser = () => {
  localStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem("twilioToken");
  const { cleanupDevice } = useCallStore.getState();
  cleanupDevice();
}

export const setUserToSession = (user: User) => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

export const verifyEmail = async (token: string) => {
  const res = await apiRequest.get(`auth/verify-email?token=${token}`);
  return res.data;
}

export const requestResetPassword = async (email: string) => {
  await apiRequest.post(`auth/request-reset-password`, { email });
}

export const resetPassword = async (newPassword: string, token: string) => {
  await apiRequest.post(`auth/reset-password`, {
    newPassword,
    token
  });
}