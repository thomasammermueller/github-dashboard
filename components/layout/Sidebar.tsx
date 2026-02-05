"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDot,
  GitPullRequest,
  GitCommit,
  Bell,
  Github,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Issues", href: "/issues", icon: CircleDot },
  { name: "Pull Requests", href: "/pulls", icon: GitPullRequest },
  { name: "Commits", href: "/commits", icon: GitCommit },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-800">
        <Github className="w-8 h-8" />
        <span className="text-xl font-bold">GitHub Dashboard</span>
      </div>

      <nav className="px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
