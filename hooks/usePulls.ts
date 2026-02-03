"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPullRequests,
  fetchAllPullRequests,
  fetchPullRequest,
  fetchPullRequestChecks,
} from "@/lib/queries/pulls";
import { useSelectedRepoContext } from "./useRepos";
import type { PullRequest, CheckRun } from "@/lib/types";

export function usePullRequests(state: "open" | "closed" | "all" = "open") {
  const repoContext = useSelectedRepoContext();

  return useQuery<PullRequest[]>({
    queryKey: ["pulls", repoContext?.owner, repoContext?.repo, state],
    queryFn: () => {
      if (repoContext) {
        return fetchPullRequests(repoContext.owner, repoContext.repo, state);
      }
      return fetchAllPullRequests(state);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePullRequest(
  owner: string,
  repo: string,
  pullNumber: number
) {
  return useQuery<PullRequest>({
    queryKey: ["pull", owner, repo, pullNumber],
    queryFn: () => fetchPullRequest(owner, repo, pullNumber),
    enabled: !!owner && !!repo && !!pullNumber,
    staleTime: 1 * 60 * 1000,
  });
}

export function usePullRequestChecks(owner: string, repo: string, ref: string) {
  return useQuery<CheckRun[]>({
    queryKey: ["pull-checks", owner, repo, ref],
    queryFn: () => fetchPullRequestChecks(owner, repo, ref),
    enabled: !!owner && !!repo && !!ref,
    staleTime: 30 * 1000, // 30 seconds
  });
}
