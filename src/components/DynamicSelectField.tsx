import { SelectItem as SelectOption } from "@/interfaces/select-items";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label";

interface DynamicSelectFieldProps {
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  label?: string;
  value?: string
}

const DynamicSelectField = (props: DynamicSelectFieldProps) => {
  return (
    <div>
      {props.label && (<Label>{props.label}</Label>)}
      <Select
        onValueChange={props.onChange}
        defaultValue={props.defaultValue || props.options[0]?.value}
        value={props.value}
        >
        <SelectTrigger className={props.className}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((item) => (
            <SelectItem value={item.value} key={item.value} className="cursor-pointer">{item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DynamicSelectField