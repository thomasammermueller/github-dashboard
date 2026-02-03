"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, FolderGit2 } from "lucide-react";
import { useRepos, useSelectedRepo, useSetSelectedRepo } from "@/hooks/useRepos";
import { Spinner } from "@/components/ui/Spinner";

export function RepoSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: repos, isLoading, error } = useRepos();
  const selectedRepo = useSelectedRepo();
  const setSelectedRepo = useSetSelectedRepo();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Spinner size="sm" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Loading repos...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
        Failed to load repositories
      </div>
    );
  }

  const selectedRepoData = repos?.find((r) => r.full_name === selectedRepo);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[200px]"
      >
        <FolderGit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white truncate">
          {selectedRepo || "All Repositories"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-auto">
          <button
            onClick={() => {
              setSelectedRepo(null);
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FolderGit2 className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">
              All Repositories
            </span>
            {!selectedRepo && <Check className="w-4 h-4 text-blue-600" />}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {repos?.map((repo) => (
            <button
              key={repo.id}
              onClick={() => {
                setSelectedRepo(repo.full_name);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-5 h-5 rounded-full"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {repo.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {repo.owner.login}
                </p>
              </div>
              {selectedRepo === repo.full_name && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
