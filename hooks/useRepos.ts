"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { fetchUserRepos, fetchRepo, fetchRepoLabels, fetchRepoCollaborators } from "@/lib/queries/repos";
import type { Repository } from "@/lib/types";

// Zustand store for selected repo
interface RepoStore {
  selectedRepo: string | null;
  setSelectedRepo: (repo: string | null) => void;
}

export const useRepoStore = create<RepoStore>((set) => ({
  selectedRepo: null,
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
}));

export function useSelectedRepo() {
  return useRepoStore((state) => state.selectedRepo);
}

export function useSetSelectedRepo() {
  return useRepoStore((state) => state.setSelectedRepo);
}

export function useSelectedRepoContext() {
  const selectedRepo = useSelectedRepo();
  if (!selectedRepo) return null;

  const [owner, repo] = selectedRepo.split("/");
  return { owner, repo };
}

export function useRepos() {
  return useQuery<Repository[]>({
    queryKey: ["repos"],
    queryFn: fetchUserRepos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRepo(owner: string, repo: string) {
  return useQuery<Repository>({
    queryKey: ["repo", owner, repo],
    queryFn: () => fetchRepo(owner, repo),
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRepoLabels(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo-labels", owner, repo],
    queryFn: () => fetchRepoLabels(owner, repo),
    enabled: !!owner && !!repo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRepoCollaborators(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo-collaborators", owner, repo],
    queryFn: () => fetchRepoCollaborators(owner, repo),
    enabled: !!owner && !!repo,
    staleTime: 10 * 60 * 1000,
  });
}
