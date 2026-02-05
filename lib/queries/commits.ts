import { githubClient } from "../github";
import type { Commit, CommitFilters, Branch } from "../types";

export async function fetchCommits(
  owner: string,
  repo: string,
  filters: CommitFilters = {}
): Promise<Commit[]> {
  const { data } = await githubClient.repos.listCommits({
    owner,
    repo,
    sha: filters.sha,
    author: filters.author,
    since: filters.since,
    until: filters.until,
    per_page: 100,
  });

  return data as Commit[];
}

export async function fetchCommit(
  owner: string,
  repo: string,
  sha: string
): Promise<Commit> {
  const { data } = await githubClient.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });

  return data as unknown as Commit;
}

export async function fetchBranches(
  owner: string,
  repo: string
): Promise<Branch[]> {
  const { data } = await githubClient.repos.listBranches({
    owner,
    repo,
    per_page: 100,
  });

  return data as Branch[];
}
