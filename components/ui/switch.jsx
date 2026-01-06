"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[20px] w-[36px] shrink-0 items-center rounded-full border border-neutral-800 bg-black transition-colors duration-300 ease-in-out",
        "data-[state=checked]:bg-black data-[state=unchecked]:bg-black",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-[16px] w-[16px] transform rounded-full bg-white",
          "ring-2 ring-white shadow-md shadow-black",
          "transition-transform duration-300",
          "data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
