import { githubClient } from "../github";
import type {
  Issue,
  IssueComment,
  IssueFilters,
  CreateIssueInput,
  UpdateIssueInput,
} from "../types";

export async function fetchIssues(
  owner: string,
  repo: string,
  filters: IssueFilters = {}
): Promise<Issue[]> {
  const { data } = await githubClient.issues.listForRepo({
    owner,
    repo,
    state: filters.state || "open",
    labels: filters.labels,
    assignee: filters.assignee,
    sort: filters.sort || "updated",
    direction: filters.direction || "desc",
    per_page: 100,
  });

  // Filter out pull requests (GitHub API returns PRs as issues)
  return (data as Issue[]).filter((issue) => !issue.pull_request);
}

export async function fetchAllIssues(
  filters: IssueFilters = {}
): Promise<Issue[]> {
  const { data } = await githubClient.issues.list({
    filter: "all",
    state: filters.state || "open",
    sort: filters.sort || "updated",
    direction: filters.direction || "desc",
    per_page: 100,
  });

  // Filter out pull requests
  return (data as Issue[]).filter((issue) => !issue.pull_request);
}

export async function fetchIssue(
  owner: string,
  repo: string,
  issueNumber: number
): Promise<Issue> {
  const { data } = await githubClient.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return data as Issue;
}

export async function fetchIssueComments(
  owner: string,
  repo: string,
  issueNumber: number
): Promise<IssueComment[]> {
  const { data } = await githubClient.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });

  return data as IssueComment[];
}

export async function createIssue(
  owner: string,
  repo: string,
  input: CreateIssueInput
): Promise<Issue> {
  const { data } = await githubClient.issues.create({
    owner,
    repo,
    title: input.title,
    body: input.body,
    labels: input.labels,
    assignees: input.assignees,
    milestone: input.milestone,
  });

  return data as Issue;
}

export async function updateIssue(
  owner: string,
  repo: string,
  issueNumber: number,
  input: UpdateIssueInput
): Promise<Issue> {
  const { data } = await githubClient.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    title: input.title,
    body: input.body,
    state: input.state,
    labels: input.labels,
    assignees: input.assignees,
    milestone: input.milestone,
  });

  return data as Issue;
}

export async function createIssueComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<IssueComment> {
  const { data } = await githubClient.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });

  return data as IssueComment;
}
