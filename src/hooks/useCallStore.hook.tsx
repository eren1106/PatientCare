import { create } from 'zustand';
import { Device, Call } from '@twilio/voice-sdk';
import { CallHistory, CallStatus, createCallHistory, getCallToken } from '@/services/call.service';
import { getCurrentUser } from '@/services/auth.service';

interface CallStore {
  device: Device | null;
  isInitialized: boolean;
  currentCall: any | null;
  initializeDevice: () => Promise<void>;
  makeCall: (recipientId: string) => Promise<void>;
  endCall: () => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  updateOutputDevice: (deviceId: string) => void;
  updateRingtoneDevice: (deviceId: string) => void;
  getAudioDevices: () => Promise<void>;
  cleanupDevice: () => void;
  
}

const useCallStore = create<CallStore>((set, get) => ({
  device: null,
  isInitialized: false,
  currentCall: null,

  initializeDevice: async () => {
    let token = localStorage.getItem('twilioToken');
    
    if (!token) {
      const res = await getCallToken();
      token = res.token;
      localStorage.setItem('twilioToken', token);
    }

    const device = new Device(token, {

  
      logLevel: 1,
      // Opus generates better quality audio, but is not supported by all browsers.
      // If Opus is not supported, we use PCMU as a fallback.
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    device.on("registered", () => {
      //console.log("Twilio.Device Ready to make and receive calls!");
    });
    
    device.on("error", (error) => {
      //console.log("Twilio.Device Error: " + error.message);
    });

    device.on("incoming", (call) => {
      set({ currentCall: call });
      window.dispatchEvent(new CustomEvent('incomingCall', { detail: call }));

      call.on("cancel", handleDisconnectedIncomingCall);
      call.on("disconnect", handleDisconnectedIncomingCall);
      call.on("reject", handleDisconnectedIncomingCall);
    });

    device?.audio?.on("deviceChange", () => {
      updateAllAudioDevices(device);
    });

    await device.register();
    set({ device, isInitialized: true });
  },

  makeCall: async (recipientId: string) => {
    //console.log("Making call to", recipientId);
    const { device } = get();
    let params = { To: recipientId };
    if (device) {
      const call = await device.connect({ params });
      set({ currentCall: call });

      let startTime: number;
      let callStatus: CallStatus = CallStatus.MISSED; 

      call.on("accept", () => {
        //console.log("Call in progress...");
        startTime = Date.now();
        callStatus = CallStatus.ACCEPTED;
      });

      call.on("disconnect", () => {
        //console.log("Call disconnected.");
        const endTime = Date.now();
        const duration = callStatus === CallStatus.ACCEPTED ? Math.round((endTime - startTime) / 1000) : 0;
        storeCallHistory(recipientId, callStatus, duration);
        set({ currentCall: null });
      });

      call.on("cancel", () => {
        //console.log("Call canceled.");
        storeCallHistory(recipientId, CallStatus.MISSED, 0);
        set({ currentCall: null });
      });

      call.on("reject", () => {
        //console.log("Call rejected.");
        callStatus = CallStatus.REJECTED;
        storeCallHistory(recipientId, CallStatus.REJECTED, 0);
        set({ currentCall: null });
      });
    } else {
      //console.error('Twilio device not initialized');
    }
  },

  endCall: () => {
    const { currentCall } = get();
    if (currentCall) {
      currentCall.disconnect();
      set({ currentCall: null });
    }
  },

  acceptIncomingCall: () => {
    const { currentCall } = get();
    if (currentCall) {
      currentCall.accept();
      console.log("Accepted incoming call.");
    }
  },

  rejectIncomingCall: () => {
    const { currentCall } = get();
    if (currentCall) {
      currentCall.reject();
      //console.log("Rejected incoming call");
      set({ currentCall: null });
    }
  },

  updateOutputDevice: (deviceId: string) => {
    const { device } = get();
    if (device) {
      device?.audio?.speakerDevices.set(deviceId);
    }
  },

  updateRingtoneDevice: (deviceId: string) => {
    const { device } = get();
    if (device) {
      device?.audio?.ringtoneDevices.set(deviceId);
    }
  },

  getAudioDevices: async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const { device } = get();
    if (device) {
      updateAllAudioDevices(device);
    }
  },

  cleanupDevice: () => {
    const { device } = get();
    if (device) {
      device.destroy();
    }
    set({ device: null, currentCall: null, isInitialized: false });
  },
}));

function handleDisconnectedIncomingCall() {
  //console.log("Incoming call ended.");
  useCallStore.setState({ currentCall: null });
}

function updateAllAudioDevices(device: Device) {
  // This function would update the UI with available audio devices
  // You might want to implement this in your UI components
  //console.log("Audio devices updated");
  ////console.log("Speaker devices:", device?.audio?.speakerDevices.get());
  //console.log("Ringtone devices:", device?.audio?.ringtoneDevices.get());
}


async function storeCallHistory(recipientId: string, status: CallStatus, duration: number) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    try {
      const callData: CallHistory = {
        fromUserId: currentUser.id,
        toUserId: recipientId,
        status: status,
        duration: duration,
      };
      await createCallHistory(callData);
      
    } catch (error) {
    }
  } else {
    console.error("No current user found");
  }
}

export default useCallStore;