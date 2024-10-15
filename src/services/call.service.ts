import { apiRequest } from "@/utils/apiRequest";
import { getCurrentUser } from './auth.service';

export const getCallToken = async (): Promise<CallToken> => {
  const userId = getCurrentUser()?.id;
  const res = await apiRequest.get(`/call/token/${userId}`);
  return res.data;
};

export const createCallHistory = async (callData: CallHistory): Promise<CallHistory> => {
  const res = await apiRequest.post('/call/callHistory', callData);
  return res.data;
};


export interface CallToken {
  token: string;
  identity: string;
}
export interface CallHistory {
  fromUserId: string;
  toUserId: string;
  status: string;
  duration: number;
}
export enum CallStatus {
  MISSED = 'MISSED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}