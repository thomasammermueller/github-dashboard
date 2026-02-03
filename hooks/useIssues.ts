"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIssues,
  fetchAllIssues,
  fetchIssue,
  fetchIssueComments,
  createIssue,
  updateIssue,
  createIssueComment,
} from "@/lib/queries/issues";
import { useSelectedRepoContext } from "./useRepos";
import type {
  Issue,
  IssueComment,
  IssueFilters,
  CreateIssueInput,
  UpdateIssueInput,
} from "@/lib/types";

export function useIssues(filters: IssueFilters = {}) {
  const repoContext = useSelectedRepoContext();

  return useQuery<Issue[]>({
    queryKey: ["issues", repoContext?.owner, repoContext?.repo, filters],
    queryFn: () => {
      if (repoContext) {
        return fetchIssues(repoContext.owner, repoContext.repo, filters);
      }
      return fetchAllIssues(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useIssue(owner: string, repo: string, issueNumber: number) {
  return useQuery<Issue>({
    queryKey: ["issue", owner, repo, issueNumber],
    queryFn: () => fetchIssue(owner, repo, issueNumber),
    enabled: !!owner && !!repo && !!issueNumber,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useIssueComments(
  owner: string,
  repo: string,
  issueNumber: number
) {
  return useQuery<IssueComment[]>({
    queryKey: ["issue-comments", owner, repo, issueNumber],
    queryFn: () => fetchIssueComments(owner, repo, issueNumber),
    enabled: !!owner && !!repo && !!issueNumber,
    staleTime: 1 * 60 * 1000,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      owner,
      repo,
      input,
    }: {
      owner: string;
      repo: string;
      input: CreateIssueInput;
    }) => createIssue(owner, repo, input),
    onSuccess: (_, { owner, repo }) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", owner, repo] });
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      owner,
      repo,
      issueNumber,
      input,
    }: {
      owner: string;
      repo: string;
      issueNumber: number;
      input: UpdateIssueInput;
    }) => updateIssue(owner, repo, issueNumber, input),
    onSuccess: (_, { owner, repo, issueNumber }) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({
        queryKey: ["issue", owner, repo, issueNumber],
      });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      owner,
      repo,
      issueNumber,
      body,
    }: {
      owner: string;
      repo: string;
      issueNumber: number;
      body: string;
    }) => createIssueComment(owner, repo, issueNumber, body),
    onSuccess: (_, { owner, repo, issueNumber }) => {
      queryClient.invalidateQueries({
        queryKey: ["issue-comments", owner, repo, issueNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["issue", owner, repo, issueNumber],
      });
    },
  });
}
