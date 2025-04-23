
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface GroupIconProps {
  picture?: string;
  color?: "blue" | "green" | "red" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GroupIcon({
  picture,
  color = "blue",
  size = "md",
  className,
}: GroupIconProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  if (picture) {
    return (
      <img
        src={picture}
        alt="Group"
        className={cn("rounded", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center text-white",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      <Users size={iconSizes[size]} />
    </div>
  );
}
