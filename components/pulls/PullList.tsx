"use client";

import { useState } from "react";
import { usePullRequests } from "@/hooks/usePulls";
import { useSelectedRepoContext } from "@/hooks/useRepos";
import { PullCard } from "./PullCard";
import { Button } from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Spinner";

export function PullList() {
  const [state, setState] = useState<"open" | "closed" | "all">("open");

  const repoContext = useSelectedRepoContext();
  const { data: pulls, isLoading, error, refetch } = usePullRequests(state);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load pull requests
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
          Pull Requests
        </h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setState("open")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            state === "open"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setState("closed")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            state === "closed"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Closed
        </button>
        <button
          onClick={() => setState("all")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            state === "all"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
      </div>

      {/* PR count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {pulls?.length || 0} pull request{pulls?.length !== 1 ? "s" : ""}
      </p>

      {/* PR list */}
      {pulls?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No pull requests found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pulls?.map((pull) => {
            // Extract owner and repo from the pull request URL
            const urlParts = pull.html_url.split("/");
            const prOwner = urlParts[3];
            const prRepo = urlParts[4];

            return (
              <PullCard
                key={pull.id}
                pull={pull}
                owner={prOwner}
                repo={prRepo}
                showRepo={!repoContext}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
