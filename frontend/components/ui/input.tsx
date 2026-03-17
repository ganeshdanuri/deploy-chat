import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full border border-border bg-white px-4 py-2 text-sm text-secondary transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-white outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-xl",
        className
      )}
      {...props}
    />
  )
}

export { Input }
