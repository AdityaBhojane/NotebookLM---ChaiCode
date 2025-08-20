import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  animated?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, animated = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const textareaComponent = (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background transition-all duration-200",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          isFocused && "ring-2 ring-primary/20 border-primary shadow-md",
          className
        )}
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );

    if (animated) {
      return (
        <motion.div
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {textareaComponent}
        </motion.div>
      );
    }

    return textareaComponent;
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
