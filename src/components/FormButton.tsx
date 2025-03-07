import React from "react"
import { Button, ButtonProps } from "./ui/button"
import Spinner from "./Spinner";

interface FormButtonProps extends ButtonProps {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ isLoading, children, ...props }, ref) => {  // Make sure ref is in parameters
    return (
      <Button
        ref={ref}  // Pass the ref to Button
        type="submit"
        className="w-min ml-auto"
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Spinner className='text-primary-foreground size-5' />}
        {children ?? "Save"}
      </Button>
    )
  }
)

FormButton.displayName = "FormButton"

export default FormButton;