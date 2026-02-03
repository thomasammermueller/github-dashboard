"use client";

import { useState } from "react";
import {
  CircleDot,
  GitPullRequest,
  MessageSquare,
  Tag,
  Bell,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Spinner";
import type { Notification } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

export function NotificationList() {
  const [showAll, setShowAll] = useState(false);
  const { data: notifications, isLoading, error, refetch } = useNotifications(showAll);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load notifications
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const getSubjectIcon = (type: string) => {
    switch (type) {
      case "Issue":
        return <CircleDot className="w-5 h-5" />;
      case "PullRequest":
        return <GitPullRequest className="w-5 h-5" />;
      case "Discussion":
        return <MessageSquare className="w-5 h-5" />;
      case "Release":
        return <Tag className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationUrl = (notification: Notification) => {
    // Convert API URL to web URL
    if (notification.subject.url) {
      const url = notification.subject.url;
      return url
        .replace("api.github.com/repos", "github.com")
        .replace("/pulls/", "/pull/");
    }
    return `https://github.com/${notification.repository.full_name}`;
  };

  const handleMarkAsRead = (notification: Notification) => {
    if (notification.unread) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const unreadCount = notifications?.filter((n) => n.unread).length || 0;

  // Group notifications by repository
  const groupedNotifications = notifications?.reduce(
    (acc, notification) => {
      const repoName = notification.repository.full_name;
      if (!acc[repoName]) {
        acc[repoName] = [];
      }
      acc[repoName].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={() => markAllAsReadMutation.mutate()}
            loading={markAllAsReadMutation.isPending}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowAll(false)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            !showAll
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setShowAll(true)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            showAll
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
      </div>

      {/* Notification list */}
      {!notifications || notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {showAll ? "No notifications" : "No unread notifications"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications || {}).map(([repoName, repoNotifications]) => (
            <div key={repoName}>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <img
                  src={repoNotifications[0].repository.owner.avatar_url}
                  alt={repoNotifications[0].repository.owner.login}
                  className="w-5 h-5 rounded-full"
                />
                {repoName}
              </h2>

              <div className="space-y-2">
                {repoNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.unread
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          notification.unread
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {getSubjectIcon(notification.subject.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            notification.unread
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.subject.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.reason} ·{" "}
                          {formatDistanceToNow(notification.updated_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {notification.unread && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification)}
                            loading={
                              markAsReadMutation.isPending &&
                              markAsReadMutation.variables === notification.id
                            }
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <a
                          href={getNotificationUrl(notification)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleMarkAsRead(notification)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
