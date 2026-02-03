import { githubClient } from "../github";
import type { PullRequest, CheckRun } from "../types";

export async function fetchPullRequests(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open"
): Promise<PullRequest[]> {
  const { data } = await githubClient.pulls.list({
    owner,
    repo,
    state,
    sort: "updated",
    direction: "desc",
    per_page: 100,
  });

  return data as PullRequest[];
}

export async function fetchAllPullRequests(
  state: "open" | "closed" | "all" = "open"
): Promise<PullRequest[]> {
  // Use GitHub Search API to find PRs authored by or involving the user
  const stateQuery = state === "all" ? "" : `+state:${state}`;
  const query = `type:pr+author:@me${stateQuery}`;

  const { data } = await githubClient.search.issuesAndPullRequests({
    q: query,
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  // Search API returns items in a slightly different format, map to PullRequest
  return (data.items || []).map((item: Record<string, unknown>) => ({
    ...item,
    // Add html_url if not present (search results have it)
    html_url: item.html_url || item.url,
  })) as PullRequest[];
}

export async function fetchPullRequest(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequest> {
  const { data } = await githubClient.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  return data as PullRequest;
}

export async function fetchPullRequestChecks(
  owner: string,
  repo: string,
  ref: string
): Promise<CheckRun[]> {
  const { data } = await githubClient.checks.listForRef({
    owner,
    repo,
    ref,
    per_page: 100,
  });

  return data.check_runs as CheckRun[];
}
