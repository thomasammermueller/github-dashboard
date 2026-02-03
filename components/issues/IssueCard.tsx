"use client";

import { CircleDot, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Issue } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showRepo?: boolean;
}

export function IssueCard({ issue, onClick, showRepo = false }: IssueCardProps) {
  const repoName = issue.repository_url.split("/").slice(-2).join("/");

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {issue.state === "open" ? (
            <CircleDot className="w-5 h-5 text-green-600 dark:text-green-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {showRepo && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {repoName}
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {issue.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {issue.labels.map((label) => (
              <Badge key={label.id} color={label.color}>
                {label.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>#{issue.number}</span>
            <span>
              opened {formatDistanceToNow(issue.created_at)} by{" "}
              {issue.user.login}
            </span>
            {issue.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {issue.comments}
              </span>
            )}
            {issue.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {issue.assignees.slice(0, 3).map((assignee) => (
                  <img
                    key={assignee.id}
                    src={assignee.avatar_url}
                    alt={assignee.login}
                    title={assignee.login}
                    className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"
                  />
                ))}
                {issue.assignees.length > 3 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-medium border-2 border-white dark:border-gray-800">
                    +{issue.assignees.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
