import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import AutoResizeTextarea from './AutoResizeTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SelectItem as Option } from '@/interfaces/select-items';
import { convertCamelCaseToTitle } from '@/utils';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import Combobox from './Combobox';

interface GenericFormFieldProps {
  control: any;
  name: string;
  label?: string;
  type?: 'input' | 'textarea' | 'select' | 'number' | 'password' | 'email' | 'date' | 'time' | 'option' | 'combobox';
  placeholder?: string;
  options?: Option[];
  minRows?: number;
  imagePreview?: string;
  noLabel?: boolean;
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
}) => {
  placeholder = placeholder ?? `Enter ${convertCamelCaseToTitle(name)}`

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let res;
        switch (type) {
          case 'input':
            res = <Input placeholder={placeholder} {...field} />;
            break;
          case 'number':
            res = <Input placeholder={placeholder} {...field} type="number" />;
            break;
          case 'email':
            res = <Input placeholder={placeholder} {...field} type="email" />;
            break;
          case 'password':
            res = <Input placeholder={placeholder} {...field} type="password" />;
            break;
          case 'textarea':
            res = <AutoResizeTextarea placeholder={placeholder} minRows={minRows!} {...field} />;
            break;
          case 'select':
            res = (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((item) => (
                    <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
            break;
          case 'date':
            res = (
              <DatePicker
                date={field.value}
                setDate={field.onChange}
              />
            )
            break;
          case 'time':
            res = (
              <TimePicker
                setDate={field.onChange}
                date={field.value}
              />
            )
            break;

          case 'option':
            res = (
              <RadioGroup
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                className="flex md:flex-row flex-col w-full md:w-auto"
              >
                {options?.map((item) => (
                  <div key={item.value} className="flex items-center justify-center border border-black px-4 py-2 cursor-pointer space-x-2 ">
                    <RadioGroupItem value={item.value} id={`${name}-${item.value}`} />
                    <Label htmlFor={`${name}-${item.value}`}>
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
            break;

          case 'combobox':
            res = (
              <Combobox
                items={options || []}
                onSelect={field.onChange}
                placeholder={placeholder}
                initialValue={field.value}
              />
            )
            break;
          default:
            res = <></>;
            break;
        }


        return (
          <FormItem>
            {
              (label || !noLabel) && (
                <FormLabel className='font-medium text-sm flex gap-1 items-center'>
                  {label || convertCamelCaseToTitle(name)}
                </FormLabel>
              )
            }
            <FormControl>
              {res}
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  );
}

export default GenericFormField;
