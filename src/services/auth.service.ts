import { USER_SESSION_KEY } from "@/constants";
import useCallStore from "@/hooks/useCallStore.hook";
import { User } from "@/interfaces/user";
import { apiCaller } from "@/utils";

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const res = await apiCaller.post(`auth/login`, {
      email,
      password
    });
    const user = res.data.data;
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

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