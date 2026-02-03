import { githubClient } from "../github";
import type { Notification } from "../types";

export async function fetchNotifications(
  all: boolean = false
): Promise<Notification[]> {
  const { data } = await githubClient.activity.listNotificationsForAuthenticatedUser({
    all,
    per_page: 100,
  });

  return data as Notification[];
}

export async function markNotificationAsRead(threadId: string): Promise<void> {
  await githubClient.activity.markThreadAsRead({
    thread_id: parseInt(threadId, 10),
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await githubClient.activity.markNotificationsAsRead({
    last_read_at: new Date().toISOString(),
  });
}
