"use client";

import { useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { useIssues } from "@/hooks/useIssues";
import { useSelectedRepoContext } from "@/hooks/useRepos";
import { IssueCard } from "./IssueCard";
import { IssueDetail } from "./IssueDetail";
import { IssueForm } from "./IssueForm";
import { Button } from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { parseRepoFromUrl } from "@/lib/utils";
import type { Issue, IssueFilters } from "@/lib/types";

export function IssueList() {
  const [filters, setFilters] = useState<IssueFilters>({ state: "open" });
  const [selectedIssueId, setSelectedIssueId] = useState<{ owner: string; repo: string; number: number } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const repoContext = useSelectedRepoContext();
  const { data: issues, isLoading, error, refetch } = useIssues(filters);

  // Find the selected issue from the current data
  const selectedIssue = selectedIssueId
    ? issues?.find(i => i.number === selectedIssueId.number)
    : null;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load issues
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Issues
        </h1>

        {repoContext && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilters({ ...filters, state: "open" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.state === "open"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilters({ ...filters, state: "closed" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.state === "closed"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Closed
        </button>
        <button
          onClick={() => setFilters({ ...filters, state: "all" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.state === "all"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
      </div>

      {/* Issue count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {issues?.length || 0} issue{issues?.length !== 1 ? "s" : ""}
      </p>

      {/* Issue list */}
      {issues?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No issues found
          </p>
          {repoContext && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first issue
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {issues?.map((issue) => {
            const repoInfo = parseRepoFromUrl(issue.repository_url);
            return (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => setSelectedIssueId(repoInfo ? { owner: repoInfo.owner, repo: repoInfo.repo, number: issue.number } : null)}
                showRepo={!repoContext}
              />
            );
          })}
        </div>
      )}

      {/* Issue detail modal */}
      {selectedIssue && selectedIssueId && (
        <Modal
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssueId(null)}
          title={`#${selectedIssue.number} ${selectedIssue.title}`}
          size="xl"
        >
          <IssueDetail
            issue={selectedIssue}
            onClose={() => setSelectedIssueId(null)}
          />
        </Modal>
      )}

      {/* Create issue modal */}
      {showCreateForm && repoContext && (
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          title="New Issue"
          size="lg"
        >
          <IssueForm
            owner={repoContext.owner}
            repo={repoContext.repo}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
