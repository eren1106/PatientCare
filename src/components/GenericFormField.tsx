import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import AutoResizeTextarea from './AutoResizeTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SelectItem as Option } from '@/interfaces/select-items';

interface GenericFormFieldProps {
  control: any;
  name: string;
  label: string;
  type?: 'input' | 'textarea' | 'select' | 'number' | 'password' | 'email';
  placeholder?: string;
  options?: Option[];
  minRows?: number;
  imagePreview?: string;
  // setValue?: UseFormSetValue<FieldValues>;
  // getValues?: UseFormGetValues<FieldValues>;
}

const GenericFormField: React.FC<GenericFormFieldProps> = ({
  control,
  name,
  label,
  type = "input",
  placeholder = "",
  options,
  minRows,
  // setValue,
  // getValues,
}) => {

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
          default:
            res = <></>;
            break;
        }


        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
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
