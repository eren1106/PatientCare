import * as React from "react";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePeriodSelect } from "@/components/ui/period-select";
import { Period } from "@/components/ui/time-picker-utils";
import { toZonedTime } from 'date-fns-tz';
import { addHours } from 'date-fns';

const MALAYSIA_TIMEZONE = 'Asia/Kuala_Lumpur';

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  // Convert input date to Malaysia timezone for display
  const displayDate = React.useMemo(() => {
    if (!date) return new Date();
    return toZonedTime(date, MALAYSIA_TIMEZONE);
  }, [date]);

  // Handle date changes with timezone conversion
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined);
      return;
    }

    // Convert the selected time to UTC for storage
    const utcDate = new Date(newDate);
    // Add 8 hours to compensate for Malaysia's UTC+8
    const adjustedDate = addHours(utcDate, 8);
    setDate(adjustedDate);
  };

  const [period, setPeriod] = React.useState<Period>(() => {
    if (displayDate) {
      const hours = displayDate.getHours();
      return hours >= 12 ? 'PM' : 'AM';
    } 
    const currentHours = new Date().getHours();
    return currentHours >= 12 ? 'PM' : 'AM';
  });
  
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <div className="grid gap-1 text-center">
        <TimePickerInput
          picker="12hours"
          period={period}
          date={displayDate}
          setDate={handleDateChange}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <TimePickerInput
          picker="minutes"
          date={displayDate}
          setDate={handleDateChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <TimePeriodSelect
        period={period}
        setPeriod={setPeriod}
        date={displayDate}
        setDate={handleDateChange}
        ref={periodRef}
        onLeftFocus={() => minuteRef.current?.focus()}
      />
    </div>
  );
}