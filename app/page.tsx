"use client";

import Link from "next/link";
import {
  CircleDot,
  GitPullRequest,
  GitCommit,
  Bell,
  Star,
  GitFork,
  ArrowRight,
} from "lucide-react";
import { useRepos, useSelectedRepoContext } from "@/hooks/useRepos";
import { useIssues } from "@/hooks/useIssues";
import { usePullRequests } from "@/hooks/usePulls";
import { useCommits } from "@/hooks/useCommits";
import { useNotifications } from "@/hooks/useNotifications";
import { LoadingPage, Spinner } from "@/components/ui/Spinner";
import { IssueCard } from "@/components/issues/IssueCard";
import { PullCard } from "@/components/pulls/PullCard";
import { CommitCard } from "@/components/commits/CommitCard";
import type { Repository } from "@/lib/types";

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  );
}

function RepoCard({ repo }: { repo: Repository }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start gap-3">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {repo.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {repo.owner.login}
          </p>
          {repo.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {repo.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function DashboardPage() {
  const repoContext = useSelectedRepoContext();
  const { data: repos, isLoading: reposLoading } = useRepos();
  const { data: issues, isLoading: issuesLoading } = useIssues({ state: "open" });
  const { data: pulls, isLoading: pullsLoading } = usePullRequests("open");
  const { data: commits, isLoading: commitsLoading } = useCommits();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  const isLoading = reposLoading || issuesLoading || pullsLoading || commitsLoading || notificationsLoading;

  if (isLoading) {
    return <LoadingPage />;
  }

  const openIssues = issues?.length || 0;
  const openPRs = pulls?.length || 0;
  const totalCommits = commits?.length || 0;
  const unreadNotifications = notifications?.filter((n) => n.unread).length || 0;

  const recentIssues = issues?.slice(0, 5) || [];
  const recentPRs = pulls?.slice(0, 5) || [];
  const recentCommits = commits?.slice(0, 5) || [];
  const topRepos = repos?.slice(0, 6) || [];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Issues"
          value={openIssues}
          icon={CircleDot}
          href="/issues"
          color="bg-green-500"
        />
        <StatCard
          title="Open Pull Requests"
          value={openPRs}
          icon={GitPullRequest}
          href="/pulls"
          color="bg-blue-500"
        />
        <StatCard
          title="Recent Commits"
          value={totalCommits}
          icon={GitCommit}
          href="/commits"
          color="bg-orange-500"
        />
        <StatCard
          title="Unread Notifications"
          value={unreadNotifications}
          icon={Bell}
          href="/notifications"
          color="bg-purple-500"
        />
      </div>

      {/* Recent Issues */}
      {recentIssues.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Issues
            </h2>
            <Link
              href="/issues"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                showRepo={!repoContext}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Pull Requests
            </h2>
            <Link
              href="/pulls"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPRs.map((pull) => {
              const urlParts = pull.html_url.split("/");
              const prOwner = urlParts[3];
              const prRepo = urlParts[4];

              return (
                <PullCard
                  key={pull.id}
                  pull={pull}
                  owner={prOwner}
                  repo={prRepo}
                  showRepo={!repoContext}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Commits */}
      {recentCommits.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Commits
            </h2>
            <Link
              href="/commits"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCommits.map((commit) => (
              <CommitCard
                key={commit.sha}
                commit={commit}
                showRepo={!repoContext}
              />
            ))}
          </div>
        </div>
      )}

      {/* Repositories */}
      {!repoContext && topRepos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
