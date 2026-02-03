"use client";

import { RepoSelector } from "./RepoSelector";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";

export function Header() {
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => n.unread).length || 0;

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <RepoSelector />

        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
