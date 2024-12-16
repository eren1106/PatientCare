import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import AutoResizeTextarea from "./AutoResizeTextarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SelectItem as Option } from "@/interfaces/select-items";
import { convertCamelCaseToTitle } from "@/utils";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Combobox from "./Combobox";
import PasswordInput from "./PasswordInput";

interface GenericFormFieldProps {
  control: any;
  name: string;
  label?: string;
  type?:
    | "input"
    | "textarea"
    | "select"
    | "number"
    | "password"
    | "email"
    | "date"
    | "time"
    | "option"
    | "combobox"
    | "custom";
  placeholder?: string;
  options?: Option[];
  minRows?: number;
  imagePreview?: string;
  noLabel?: boolean;
  customChildren?: React.ReactNode;
  description?: string;
}

const GenericFormField: React.FC<GenericFormFieldProps> = ({
  control,
  name,
  label,
  type = "input",
  placeholder,
  options,
  minRows,
  noLabel = false,
  customChildren,
  description,
}) => {
  placeholder = placeholder ?? `Enter ${convertCamelCaseToTitle(name)}`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let res;
        switch (type) {
          case "input":
            res = <Input placeholder={placeholder} {...field} />;
            break;
          case "number":
            res = <Input placeholder={placeholder} {...field} type="number" />;
            break;
          case "email":
            res = <Input placeholder={placeholder} {...field} type="email" />;
            break;
          case "password":
            res = <PasswordInput placeholder={placeholder} {...field} />;
            break;
          case "textarea":
            res = (
              <AutoResizeTextarea
                placeholder={placeholder}
                minRows={minRows!}
                {...field}
              />
            );
            break;
          case "select":
            res = (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
            break;
          case "date":
            res = <DatePicker date={field.value} setDate={field.onChange} />;
            break;
          case "time":
            res = <TimePicker setDate={field.onChange} date={field.value} />;
            break;

          case "option":
            res = (
              <RadioGroup
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                className="grid grid-cols-3 gap-3 w-full"
              >
                {options?.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center border rounded-md px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <RadioGroupItem
                      value={item.value}
                      id={`${name}-${item.value}`}
                    />
                    <Label
                      htmlFor={`${name}-${item.value}`}
                      className="ml-2 cursor-pointer flex-1"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
            break;

          case "combobox":
            res = (
              <Combobox
                items={options || []}
                onSelect={field.onChange}
                placeholder={placeholder}
                initialValue={field.value}
              />
            );
            break;
          case "custom":
            res = customChildren;
            break;
          default:
            res = <></>;
            break;
        }

        return (
          <FormItem>
            {(label || !noLabel) && (
              <FormLabel className="font-medium text-sm flex gap-1 items-center">
                {label || convertCamelCaseToTitle(name)}
              </FormLabel>
            )}
            {description && (
              <FormDescription className="whitespace-pre">
                {description}
              </FormDescription>
            )}
            <FormControl>{res}</FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default GenericFormField;
