"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCommits, fetchCommit, fetchBranches } from "@/lib/queries/commits";
import { useSelectedRepoContext, useRepos } from "./useRepos";
import type { Commit, CommitFilters, Branch } from "@/lib/types";

export function useCommits(filters: CommitFilters = {}) {
  const repoContext = useSelectedRepoContext();
  const { data: repos } = useRepos();

  return useQuery<Commit[]>({
    queryKey: ["commits", repoContext?.owner, repoContext?.repo, filters],
    queryFn: async () => {
      if (repoContext) {
        return fetchCommits(repoContext.owner, repoContext.repo, filters);
      }
      // Fetch commits from multiple repos when no repo is selected
      if (!repos || repos.length === 0) return [];

      const recentRepos = repos.slice(0, 5);
      const allCommits: Commit[] = [];

      for (const repo of recentRepos) {
        try {
          const commits = await fetchCommits(repo.owner.login, repo.name, filters);
          const commitsWithRepo = commits.slice(0, 10).map((commit) => ({
            ...commit,
            repository: {
              full_name: repo.full_name,
              owner: { login: repo.owner.login },
              name: repo.name,
            },
          }));
          allCommits.push(...commitsWithRepo);
        } catch {
          // Skip repos that fail
        }
      }

      // Sort by date and return most recent
      return allCommits
        .sort((a, b) =>
          new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
        )
        .slice(0, 50);
    },
    enabled: !!repoContext || (!!repos && repos.length > 0),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCommit(owner: string, repo: string, sha: string) {
  return useQuery<Commit>({
    queryKey: ["commit", owner, repo, sha],
    queryFn: () => fetchCommit(owner, repo, sha),
    enabled: !!owner && !!repo && !!sha,
    staleTime: 5 * 60 * 1000, // 5 minutes (commits don't change)
  });
}

export function useBranches() {
  const repoContext = useSelectedRepoContext();

  return useQuery<Branch[]>({
    queryKey: ["branches", repoContext?.owner, repoContext?.repo],
    queryFn: () => {
      if (!repoContext) return [];
      return fetchBranches(repoContext.owner, repoContext.repo);
    },
    enabled: !!repoContext,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
