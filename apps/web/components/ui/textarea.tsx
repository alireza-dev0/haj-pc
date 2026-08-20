import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none border border-border bg-elevated-surface px-3 py-2 text-md/normal text-text-primary transition-colors duration-150 ease-out outline-none rounded-sm placeholder:text-text-muted focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
