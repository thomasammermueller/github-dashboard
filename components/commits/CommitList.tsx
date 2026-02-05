"use client";

import { useState } from "react";
import { GitBranch, ChevronDown } from "lucide-react";
import { useCommits, useBranches } from "@/hooks/useCommits";
import { useSelectedRepoContext } from "@/hooks/useRepos";
import { CommitCard } from "./CommitCard";
import { Button } from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Spinner";

export function CommitList() {
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const repoContext = useSelectedRepoContext();
  const { data: branches } = useBranches();
  const { data: commits, isLoading, error, refetch } = useCommits({ sha: selectedBranch });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load commits
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const currentBranchName = selectedBranch || (branches?.find(b => b.name === "main")?.name) || (branches?.find(b => b.name === "master")?.name) || branches?.[0]?.name || "default";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Commits
        </h1>

        {/* Branch Selector */}
        {repoContext && branches && branches.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{currentBranchName}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                  {branches.map((branch) => (
                    <button
                      key={branch.name}
                      onClick={() => {
                        setSelectedBranch(branch.name);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        (selectedBranch === branch.name || (!selectedBranch && branch.name === currentBranchName))
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <GitBranch className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{branch.name}</span>
                      {branch.protected && (
                        <span className="ml-auto text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                          protected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      {!repoContext && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing recent commits from your top repositories. Select a repository to see all commits and branches.
        </p>
      )}

      {/* Commit count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {commits?.length || 0} commit{commits?.length !== 1 ? "s" : ""}
        {repoContext && selectedBranch && ` on ${selectedBranch}`}
      </p>

      {/* Commit list */}
      {commits?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No commits found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {commits?.map((commit) => (
            <CommitCard
              key={commit.sha}
              commit={commit}
              showRepo={!repoContext}
            />
          ))}
        </div>
      )}
    </div>
  );
}
