import { Octokit } from "@octokit/rest";

// Server-side only - for API routes
export const getOctokit = () => {
  if (typeof window !== "undefined") {
    throw new Error("getOctokit should only be called on the server");
  }
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
};

// Client-side API wrapper that goes through our Next.js API route
class GitHubClient {
  private baseUrl = "/api/github";

  // Helper to filter out undefined values from params
  private cleanParams(params: Record<string, unknown>): Record<string, string> {
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = String(value);
      }
    }
    return cleaned;
  }

  async request(method: string, path: string, data?: unknown) {
    const url = `${this.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data && (method === "POST" || method === "PATCH")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Repos
  repos = {
    listForAuthenticatedUser: async (params: { sort?: string; per_page?: number; type?: string }) => {
      const searchParams = new URLSearchParams(this.cleanParams(params));
      return { data: await this.request("GET", `/user/repos?${searchParams}`) };
    },
    get: async (params: { owner: string; repo: string }) => {
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}`) };
    },
    listCollaborators: async (params: { owner: string; repo: string; per_page?: number }) => {
      const searchParams = new URLSearchParams({ per_page: String(params.per_page || 100) });
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/collaborators?${searchParams}`) };
    },
  };

  // Issues
  issues = {
    listForRepo: async (params: { owner: string; repo: string; state?: string; labels?: string; assignee?: string; sort?: string; direction?: string; per_page?: number }) => {
      const { owner, repo, ...rest } = params;
      const searchParams = new URLSearchParams(this.cleanParams(rest));
      return { data: await this.request("GET", `/repos/${owner}/${repo}/issues?${searchParams}`) };
    },
    list: async (params: { filter?: string; state?: string; sort?: string; direction?: string; per_page?: number }) => {
      const searchParams = new URLSearchParams(this.cleanParams(params));
      return { data: await this.request("GET", `/issues?${searchParams}`) };
    },
    get: async (params: { owner: string; repo: string; issue_number: number }) => {
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/issues/${params.issue_number}`) };
    },
    create: async (params: { owner: string; repo: string; title: string; body?: string; labels?: string[]; assignees?: string[]; milestone?: number }) => {
      const { owner, repo, ...data } = params;
      return { data: await this.request("POST", `/repos/${owner}/${repo}/issues`, data) };
    },
    update: async (params: { owner: string; repo: string; issue_number: number; title?: string; body?: string; state?: string; labels?: string[]; assignees?: string[]; milestone?: number | null }) => {
      const { owner, repo, issue_number, ...data } = params;
      return { data: await this.request("PATCH", `/repos/${owner}/${repo}/issues/${issue_number}`, data) };
    },
    listComments: async (params: { owner: string; repo: string; issue_number: number; per_page?: number }) => {
      const searchParams = new URLSearchParams({ per_page: String(params.per_page || 100) });
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/comments?${searchParams}`) };
    },
    createComment: async (params: { owner: string; repo: string; issue_number: number; body: string }) => {
      const { owner, repo, issue_number, ...data } = params;
      return { data: await this.request("POST", `/repos/${owner}/${repo}/issues/${issue_number}/comments`, data) };
    },
    listLabelsForRepo: async (params: { owner: string; repo: string; per_page?: number }) => {
      const searchParams = new URLSearchParams({ per_page: String(params.per_page || 100) });
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/labels?${searchParams}`) };
    },
  };

  // Pulls
  pulls = {
    list: async (params: { owner: string; repo: string; state?: string; sort?: string; direction?: string; per_page?: number }) => {
      const { owner, repo, ...rest } = params;
      const searchParams = new URLSearchParams(this.cleanParams(rest));
      return { data: await this.request("GET", `/repos/${owner}/${repo}/pulls?${searchParams}`) };
    },
    get: async (params: { owner: string; repo: string; pull_number: number }) => {
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/pulls/${params.pull_number}`) };
    },
  };

  // Checks
  checks = {
    listForRef: async (params: { owner: string; repo: string; ref: string; per_page?: number }) => {
      const searchParams = new URLSearchParams({ per_page: String(params.per_page || 100) });
      return { data: await this.request("GET", `/repos/${params.owner}/${params.repo}/commits/${params.ref}/check-runs?${searchParams}`) };
    },
  };

  // Search
  search = {
    issuesAndPullRequests: async (params: { q: string; sort?: string; order?: string; per_page?: number }) => {
      const searchParams = new URLSearchParams(this.cleanParams(params));
      return { data: await this.request("GET", `/search/issues?${searchParams}`) };
    },
  };

  // Activity (Notifications)
  activity = {
    listNotificationsForAuthenticatedUser: async (params: { all?: boolean; per_page?: number }) => {
      const searchParams = new URLSearchParams(this.cleanParams({
        all: params.all || false,
        per_page: params.per_page || 100,
      }));
      return { data: await this.request("GET", `/notifications?${searchParams}`) };
    },
    markThreadAsRead: async (params: { thread_id: number }) => {
      return { data: await this.request("PATCH", `/notifications/threads/${params.thread_id}`, {}) };
    },
    markNotificationsAsRead: async (params: { last_read_at?: string }) => {
      return { data: await this.request("PATCH", `/notifications`, params) };
    },
  };
}

// Export a singleton for client-side use
export const githubClient = new GitHubClient();
