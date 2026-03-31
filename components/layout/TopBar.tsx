import React from "react";
import { Bell, Menu, User } from "lucide-react";
import { logout } from "@/lib/actions/auth";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-[#1F1F1F]">
      <div className="flex items-center">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:text-white"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        {/* <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-[#1F1F1F] dark:hover:text-gray-300">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button> */}

        <div className="relative ml-3">
          <form action={logout}>
            <button
              type="submit"
              className="flex max-w-xs items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-[#1F1F1F] dark:text-gray-300"
            >
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
