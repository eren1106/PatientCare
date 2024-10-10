import * as React from "react";
// import { Clock } from "lucide-react";
// import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePeriodSelect } from "@/components/ui/period-select";
import { Period } from "@/components/ui/time-picker-utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>("PM");
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <div className="grid gap-1 text-center">
        {/* <Label htmlFor="hours" className="text-xs">
          Hours
        </Label> */}
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        {/* <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label> */}
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <TimePeriodSelect
        period={period}
        setPeriod={setPeriod}
        date={date}
        setDate={setDate}
        ref={periodRef}
        onLeftFocus={() => minuteRef.current?.focus()}
      />
    </div>
  );
}