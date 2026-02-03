"use client";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "default" | "outline";
  className?: string;
}

export function Badge({
  children,
  color,
  variant = "default",
  className = "",
}: BadgeProps) {
  const getBackgroundColor = (hexColor: string | undefined) => {
    if (!hexColor) return undefined;
    return `#${hexColor}20`; // Add transparency
  };

  const getBorderColor = (hexColor: string | undefined) => {
    if (!hexColor) return undefined;
    return `#${hexColor}`;
  };

  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

  if (color) {
    return (
      <span
        className={`${baseStyles} ${className}`}
        style={{
          backgroundColor: getBackgroundColor(color),
          borderColor: getBorderColor(color),
          color: `#${color}`,
          border: "1px solid",
        }}
      >
        {children}
      </span>
    );
  }

  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    outline:
      "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
