import { githubClient } from "../github";
import type { Repository } from "../types";

export async function fetchUserRepos(): Promise<Repository[]> {
  const { data } = await githubClient.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
    type: "all",
  });

  return data as Repository[];
}

export async function fetchRepo(
  owner: string,
  repo: string
): Promise<Repository> {
  const { data } = await githubClient.repos.get({
    owner,
    repo,
  });

  return data as Repository;
}

export async function fetchRepoLabels(
  owner: string,
  repo: string
): Promise<{ id: number; name: string; color: string }[]> {
  const { data } = await githubClient.issues.listLabelsForRepo({
    owner,
    repo,
    per_page: 100,
  });

  return data;
}

export async function fetchRepoCollaborators(
  owner: string,
  repo: string
): Promise<{ login: string; avatar_url: string }[]> {
  try {
    const { data } = await githubClient.repos.listCollaborators({
      owner,
      repo,
      per_page: 100,
    });
    return data;
  } catch {
    // If user doesn't have permission to list collaborators, return empty array
    return [];
  }
}
