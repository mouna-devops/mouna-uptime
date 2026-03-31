"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Globe, BellRing, Settings, CreditCard, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/dashboard/monitors", icon: Globe },
  { name: "Alerts", href: "/dashboard/alerts", icon: BellRing },
  { name: "Status Pages", href: "/dashboard/status-pages", icon: PanelsTopLeft },
  // { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#1F1F1F]">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
         <Image src="/logo.png" alt="MouNa Monitoring" width={64} height={64} />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
