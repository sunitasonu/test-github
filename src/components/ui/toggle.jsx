import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
// import { cva } from "class-variance-authority";
import { toggleVariants } from "./toggleVariants";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
