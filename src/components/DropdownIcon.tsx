import { LucideProps } from "lucide-react"
import DropdownTrigger from "./DropdownTrigger"

interface DropdownIconProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>,
  content: React.ReactNode,
  number: number,
}
const DropdownIcon = (props: DropdownIconProps) => {
  return (
    <div className='relative'>
      <DropdownTrigger
        content={props.content}
        contentClassName='p-0'
      >
        <props.icon size={22} />
      </DropdownTrigger>
      <div className='absolute -top-2.5 -right-2.5 rounded-full size-5 bg-primary text-background text-xs font-medium flex justify-center items-center'>
        {props.number}
      </div>
    </div>
  )
}

export default DropdownIcon;