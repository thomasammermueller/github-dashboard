"use client";

import { useState } from "react";
import {
  CircleDot,
  CheckCircle2,
  ExternalLink,
  Edit,
  Send,
} from "lucide-react";
import { useIssue, useIssueComments, useUpdateIssue, useCreateComment } from "@/hooks/useIssues";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { IssueForm } from "./IssueForm";
import type { Issue } from "@/lib/types";
import { formatDistanceToNow, parseRepoFromUrl } from "@/lib/utils";

interface IssueDetailProps {
  issue: Issue;
  onClose: () => void;
}

export function IssueDetail({ issue: initialIssue, onClose }: IssueDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");

  const repoInfo = parseRepoFromUrl(initialIssue.repository_url);
  const owner = repoInfo?.owner || "";
  const repo = repoInfo?.repo || "";

  // Fetch fresh issue data to get updates after editing
  const { data: freshIssue } = useIssue(owner, repo, initialIssue.number);
  const issue = freshIssue || initialIssue;

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useIssueComments(owner, repo, issue.number);

  const updateIssueMutation = useUpdateIssue();
  const createCommentMutation = useCreateComment();

  const handleToggleState = () => {
    updateIssueMutation.mutate({
      owner,
      repo,
      issueNumber: issue.number,
      input: { state: issue.state === "open" ? "closed" : "open" },
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    createCommentMutation.mutate(
      {
        owner,
        repo,
        issueNumber: issue.number,
        body: newComment,
      },
      {
        onSuccess: () => setNewComment(""),
      }
    );
  };

  if (isEditing) {
    return (
      <IssueForm
        owner={owner}
        repo={repo}
        issue={issue}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {issue.state === "open" ? (
            <CircleDot className="w-6 h-6 text-green-600 dark:text-green-500" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Opened {formatDistanceToNow(issue.created_at)} by{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {issue.user.login}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4" />
          </Button>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Labels */}
      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {issue.labels.map((label) => (
            <Badge key={label.id} color={label.color}>
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Body */}
      {issue.body && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{issue.body}</div>
        </div>
      )}

      {/* Assignees */}
      {issue.assignees.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assignees
          </p>
          <div className="flex flex-wrap gap-2">
            {issue.assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <img
                  src={assignee.avatar_url}
                  alt={assignee.login}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {assignee.login}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle state button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant={issue.state === "open" ? "danger" : "primary"}
          onClick={handleToggleState}
          loading={updateIssueMutation.isPending}
        >
          {issue.state === "open" ? "Close Issue" : "Reopen Issue"}
        </Button>
      </div>

      {/* Comments */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Comments ({comments?.length || 0})
        </h3>

        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.login}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {comment.user.login}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(comment.created_at)}
                  </span>
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  <div className="whitespace-pre-wrap">{comment.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              loading={createCommentMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
