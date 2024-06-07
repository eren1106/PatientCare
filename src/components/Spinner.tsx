import { Loader2 } from 'lucide-react'

const Spinner = () => {
  return (
    <div className='w-full flex justify-center'>
      <Loader2 className="mr-2 size-10 animate-spin text-primary" />
    </div>
  )
}

export default Spinner