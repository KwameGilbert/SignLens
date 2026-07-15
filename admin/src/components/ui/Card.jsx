import { cn } from "../../utils/cn";

export function Card({ className, ...props }) {
  return (
    <div className={cn("rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]", className)} {...props} />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6 border-b border-white/[0.04]", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-bold tracking-tight text-white", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-xs text-gray-400 mt-1", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
