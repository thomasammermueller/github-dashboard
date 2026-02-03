export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  private: boolean;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: "open" | "closed";
  due_on: string | null;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  user: User;
  labels: Label[];
  assignees: User[];
  milestone: Milestone | null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  repository_url: string;
  pull_request?: {
    url: string;
  };
}

export interface IssueComment {
  id: number;
  body: string;
  user: User;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  user: User;
  labels: Label[];
  assignees: User[];
  milestone: Milestone | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  draft?: boolean;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  mergeable?: boolean | null;
  mergeable_state?: string;
}

export interface CheckRun {
  id: number;
  name: string;
  status: "queued" | "in_progress" | "completed";
  conclusion:
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "skipped"
    | "timed_out"
    | "action_required"
    | null;
  html_url: string;
}

export interface NotificationSubject {
  title: string;
  url: string | null;
  type: "Issue" | "PullRequest" | "Release" | "Discussion" | "Commit";
}

export interface Notification {
  id: string;
  unread: boolean;
  reason: string;
  subject: NotificationSubject;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
  updated_at: string;
  url: string;
}

export interface IssueFilters {
  state?: "open" | "closed" | "all";
  labels?: string;
  assignee?: string;
  sort?: "created" | "updated" | "comments";
  direction?: "asc" | "desc";
}

export interface CreateIssueInput {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
}

export interface UpdateIssueInput {
  title?: string;
  body?: string;
  state?: "open" | "closed";
  labels?: string[];
  assignees?: string[];
  milestone?: number | null;
}

export interface RepoContext {
  owner: string;
  repo: string;
}
