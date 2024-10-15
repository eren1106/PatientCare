import React, { useState, useEffect, useRef } from 'react';
import useCallStore from '@/hooks/useCallStore.hook';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface OutgoingCallComponentProps {
  recipientId: string;
  onClose: () => void;
}

const OutgoingCall: React.FC<OutgoingCallComponentProps> = ({ recipientId, onClose }) => {
  const { makeCall, endCall, currentCall } = useCallStore();
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [duration, setDuration] = useState(0);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initCall = async () => {
      setCallStatus('Calling...');
      await makeCall(recipientId);
    };
    initCall();

    return () => {
      endCall();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recipientId, makeCall, endCall]);

  useEffect(() => {
    if (currentCall) {
      currentCall.on('accept', () => {
        setCallStatus('Connected');
        setIsCallAccepted(true);
        startTimer();
      });
      currentCall.on('disconnect', () => {
        setCallStatus('Disconnected');
        setIsCallAccepted(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        onClose();
      });
    }
  }, [currentCall,, onClose]);

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

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <div className="flex flex-col items-center gap-4">
    <h2 className="text-xl font-semibold">
      {isCallAccepted ? 'Call in Progress' : 'Calling...'}
    </h2>
    <p>{callStatus}</p>
    {isCallAccepted && <p>Duration: {formatDuration(duration)}</p>}
    <div className="flex gap-4">
      <Button onClick={handleEndCall} variant="destructive">
        <Phone className="mr-2" /> End Call
      </Button>
    </div>
  </div>
  );
};

export default OutgoingCall;