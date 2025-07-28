import { cva, VariantProps } from "class-variance-authority";
import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
const buttonVariants = cva("px-4 py-2 rounded-full font-medium cursor-pointer", {
  variants: {
    variant: {
      primary: "bg-black text-white",
      secondary: "bg-gray-200 text-gray-800",
      tertiary: "border border-gray-400 text-gray-700",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

// Tipagem do Button (Variants + Props do HTML Button)
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
  variant,
  className,
  children,
  ...otherProps
}) => {
  return (
    <button
      className={clsx(buttonVariants({ variant }), className)}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
