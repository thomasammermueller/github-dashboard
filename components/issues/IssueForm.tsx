"use client";

import { useState } from "react";
import { useCreateIssue, useUpdateIssue } from "@/hooks/useIssues";
import { useRepoLabels, useRepoCollaborators } from "@/hooks/useRepos";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Issue, CreateIssueInput, UpdateIssueInput } from "@/lib/types";

interface IssueFormProps {
  owner: string;
  repo: string;
  issue?: Issue;
  onSuccess: () => void;
  onCancel: () => void;
}

export function IssueForm({
  owner,
  repo,
  issue,
  onSuccess,
  onCancel,
}: IssueFormProps) {
  const [title, setTitle] = useState(issue?.title || "");
  const [body, setBody] = useState(issue?.body || "");
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    issue?.labels.map((l) => l.name) || []
  );
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    issue?.assignees.map((a) => a.login) || []
  );

  const { data: labels } = useRepoLabels(owner, repo);
  const { data: collaborators } = useRepoCollaborators(owner, repo);

  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();

  const isEditing = !!issue;
  const isPending = createIssueMutation.isPending || updateIssueMutation.isPending;

  const toggleLabel = (labelName: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelName)
        ? prev.filter((l) => l !== labelName)
        : [...prev, labelName]
    );
  };

  const toggleAssignee = (login: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(login)
        ? prev.filter((a) => a !== login)
        : [...prev, login]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (isEditing) {
      const input: UpdateIssueInput = {
        title,
        body,
        labels: selectedLabels,
        assignees: selectedAssignees,
      };

      updateIssueMutation.mutate(
        { owner, repo, issueNumber: issue.number, input },
        { onSuccess }
      );
    } else {
      const input: CreateIssueInput = {
        title,
        body: body || undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
        assignees: selectedAssignees.length > 0 ? selectedAssignees : undefined,
      };

      createIssueMutation.mutate({ owner, repo, input }, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Body */}
      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe the issue..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Labels */}
      {labels && labels.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabel(label.name)}
                className={`transition-opacity ${
                  selectedLabels.includes(label.name)
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-75"
                }`}
              >
                <Badge color={label.color}>{label.name}</Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assignees */}
      {collaborators && collaborators.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assignees
          </label>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collaborator) => (
              <button
                key={collaborator.login}
                type="button"
                onClick={() => toggleAssignee(collaborator.login)}
                className={`flex items-center gap-2 px-2 py-1 rounded-full border transition-colors ${
                  selectedAssignees.includes(collaborator.login)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <img
                  src={collaborator.avatar_url}
                  alt={collaborator.login}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {collaborator.login}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending} disabled={!title.trim()}>
          {isEditing ? "Update Issue" : "Create Issue"}
        </Button>
      </div>
    </form>
  );
}
