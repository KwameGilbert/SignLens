import { cn } from "../../utils/cn";

export function Button({ className, variant = "primary", size = "default", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-white hover:bg-primary-deep focus-visible:ring-primary": variant === "primary",
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500": variant === "secondary",
          "bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500": variant === "outline",
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600": variant === "destructive",
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-10 w-10 p-2": size === "icon",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
