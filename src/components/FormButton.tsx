import React from "react"
import { Button, ButtonProps } from "./ui/button"
import Spinner from "./Spinner";

interface FormButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(({ isLoading, ...props }) => {
  return (
    <Button
      type="submit"
      className="w-min ml-auto"
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Spinner className='text-primary-foreground size-5' />}
      Save
    </Button>
  )
}
)

FormButton.displayName = "FormButton"

export default FormButton;