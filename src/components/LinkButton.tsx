import { Button, ButtonProps } from './ui/button';
import { Link } from 'react-router-dom';

interface LinkButtonProps extends ButtonProps {
  to: string;
  openNewTab?: boolean;
}

const LinkButton = ({
  to,
  openNewTab = false,
  ...props
}: LinkButtonProps) => {
  return (
    <Button asChild {...props}>
      <Link to={to} target={openNewTab ? '_blank' : ''}>{props.children}</Link>
    </Button>
  )
}

export default LinkButton