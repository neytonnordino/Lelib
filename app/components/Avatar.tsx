import React, { HtmlHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

function Avatar(props: HtmlHTMLAttributes<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div
      className={twMerge(
        "rounded-full overflow-hidden bg-neutral-900",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Avatar;
