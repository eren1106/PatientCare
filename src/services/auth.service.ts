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
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
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
  const userString = sessionStorage.getItem(USER_SESSION_KEY);
  if(!userString) return null;

  const user = JSON.parse(userString);
  return user;
}

export const logoutUser = () => {
  sessionStorage.removeItem(USER_SESSION_KEY);
  sessionStorage.removeItem("twilioToken");
  const { cleanupDevice } = useCallStore.getState();
  cleanupDevice();
}

export const setUserToSession = (user: User) => {
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

export const verifyEmail = async (token: string) => {
  const res = await apiRequest.get(`auth/verify-email?token=${token}`);
  return res.data;
}
