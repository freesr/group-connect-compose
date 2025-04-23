
import { User } from "@/lib/api";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap: Record<string, string> = {
  EG: "bg-pink-500",
  PU: "bg-emerald-500",
  KP: "bg-purple-500",
  JD: "bg-blue-500",
  JS: "bg-amber-500",
  AJ: "bg-indigo-500",
  SW: "bg-red-500",
  MD: "bg-cyan-500",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const bgColor = colorMap[user.initials] || "bg-gray-500";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-medium",
        bgColor,
        sizeClasses[size],
        className
      )}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}

export function UserAvatarGroup({
  users,
  max = 3,
  size = "md",
}: {
  users: User[];
  max?: number;
  size?: "sm" | "md" | "lg";
}) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <UserAvatar key={user.id} user={user} size={size} />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center text-white font-medium bg-gray-700",
            size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
