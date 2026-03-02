import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full border border-[#e3e2e5] bg-white px-4 py-2 text-sm text-[#201f32] transition-all placeholder:text-[#a1a1a1] focus:border-[#262ef2] focus:bg-white outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
