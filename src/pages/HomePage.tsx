import { Button } from '@/components/ui/button'
import { DASHBOARD_ROOT_PATH } from '@/constants'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className=''>
      <Link to={DASHBOARD_ROOT_PATH}>
        <Button>
          To Doctor Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default HomePage