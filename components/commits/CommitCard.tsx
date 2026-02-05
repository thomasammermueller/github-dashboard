"use client";

import { GitCommit, ExternalLink } from "lucide-react";
import type { Commit } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface CommitCardProps {
  commit: Commit;
  showRepo?: boolean;
}

export function CommitCard({ commit, showRepo = false }: CommitCardProps) {
  const shortSha = commit.sha.substring(0, 7);
  const messageLines = commit.commit.message.split("\n");
  const title = messageLines[0];
  const hasDescription = messageLines.length > 1 && messageLines[1].trim();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <GitCommit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          {showRepo && commit.repository && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {commit.repository.full_name}
            </span>
          )}

          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
            {title}
          </h3>

          {hasDescription && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
              {messageLines.slice(1).join(" ").trim()}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">
              {shortSha}
            </code>
            <span className="flex items-center gap-1.5">
              {commit.author?.avatar_url && (
                <img
                  src={commit.author.avatar_url}
                  alt={commit.commit.author.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              {commit.commit.author.name}
            </span>
            <span>{formatDistanceToNow(commit.commit.author.date)}</span>
          </div>
        </div>

        <a
          href={commit.html_url}
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
