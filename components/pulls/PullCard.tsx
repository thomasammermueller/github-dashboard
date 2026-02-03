"use client";

import {
  GitPullRequest,
  GitMerge,
  GitPullRequestClosed,
  ExternalLink,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { usePullRequestChecks } from "@/hooks/usePulls";
import type { PullRequest } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface PullCardProps {
  pull: PullRequest;
  owner: string;
  repo: string;
  showRepo?: boolean;
}

export function PullCard({ pull, owner, repo, showRepo = false }: PullCardProps) {
  const { data: checks } = usePullRequestChecks(owner, repo, pull.head.sha);

  const getStatusIcon = () => {
    if (pull.merged_at) {
      return <GitMerge className="w-5 h-5 text-purple-600 dark:text-purple-500" />;
    }
    if (pull.state === "closed") {
      return (
        <GitPullRequestClosed className="w-5 h-5 text-red-600 dark:text-red-500" />
      );
    }
    return (
      <GitPullRequest className="w-5 h-5 text-green-600 dark:text-green-500" />
    );
  };

  const getChecksSummary = () => {
    if (!checks || checks.length === 0) return null;

    const completed = checks.filter((c) => c.status === "completed");
    const success = completed.filter((c) => c.conclusion === "success");
    const failed = completed.filter(
      (c) => c.conclusion === "failure" || c.conclusion === "cancelled"
    );
    const pending = checks.filter((c) => c.status !== "completed");

    if (pending.length > 0) {
      return (
        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
          <Clock className="w-3 h-3" />
          {pending.length} pending
        </span>
      );
    }

    if (failed.length > 0) {
      return (
        <span className="flex items-center gap-1 text-red-600 dark:text-red-500">
          <X className="w-3 h-3" />
          {failed.length} failed
        </span>
      );
    }

    if (success.length > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
          <Check className="w-3 h-3" />
          {success.length} passed
        </span>
      );
    }

    return null;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-1">{getStatusIcon()}</div>

        <div className="flex-1 min-w-0">
          {showRepo && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {owner}/{repo}
            </span>
          )}

          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {pull.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {pull.draft && <Badge variant="outline">Draft</Badge>}
            {pull.labels.map((label) => (
              <Badge key={label.id} color={label.color}>
                {label.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>#{pull.number}</span>
            <span>
              {pull.merged_at
                ? `merged ${formatDistanceToNow(pull.merged_at)}`
                : pull.state === "closed"
                  ? `closed ${formatDistanceToNow(pull.closed_at!)}`
                  : `opened ${formatDistanceToNow(pull.created_at)}`}{" "}
              by {pull.user.login}
            </span>
            {getChecksSummary()}
            <span className="text-gray-400 dark:text-gray-500">
              {pull.head.ref} → {pull.base.ref}
            </span>
          </div>
        </div>

        <a
          href={pull.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
