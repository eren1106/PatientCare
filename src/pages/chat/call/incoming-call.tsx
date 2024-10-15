import React, { useState, useEffect, useRef } from "react";
import useCallStore from "@/hooks/useCallStore.hook";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone,  PhoneOff } from "lucide-react";

const IncomingCall: React.FC = () => {
  const { currentCall, acceptIncomingCall, rejectIncomingCall, endCall } = useCallStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleIncomingCall = () => setIsOpen(true);
    window.addEventListener("incomingCall", handleIncomingCall);
    return () => window.removeEventListener("incomingCall", handleIncomingCall);
  }, []);

  useEffect(() => {
    if (!currentCall) {
      setIsOpen(false);
      setIsCallAccepted(false);
      setDuration(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      currentCall.on('accept', () => {
        setIsCallAccepted(true);
        startTimer();
      });
      currentCall.on('disconnect', () => {
        setIsOpen(false);
        setIsCallAccepted(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      });
    }
  }, [currentCall]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    acceptIncomingCall();
    //setIsOpen(false);
  };

  const handleReject = () => {
    rejectIncomingCall();
    //(false);
  };

  const handleEndCall = () => {
    endCall();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCallAccepted ? "Call in Progress" : "Incoming Call"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {isCallAccepted ? (
            <>
              <p>Duration: {formatDuration(duration)}</p>
              <Button onClick={handleEndCall} variant="destructive">
                <Phone /> End Call
              </Button>
            </>
          ) : (
            <>
              <p>You have an incoming call</p>
              <div className="flex gap-4">
                <Button onClick={handleAccept}>
                  <Phone /> 
                  Accept
                </Button>
                <Button onClick={handleReject} variant="destructive">
                  <PhoneOff /> 
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCall;
