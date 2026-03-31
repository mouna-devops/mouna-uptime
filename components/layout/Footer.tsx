import React from "react";
import Link from "next/link";
import { Activity, Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                MouNa<span className="text-primary">Monitoring</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Monitor your websites, APIs, and servers in real-time. Never miss downtime and keep your users informed with beautiful status pages.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Features</Link></li>
              <li><Link href="/#pricing" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Pricing</Link></li>
              <li><Link href="/status/demo" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Status Pages</Link></li>
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">About</Link></li>
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Blog</Link></li>
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Careers</Link></li>
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Privacy Policy</Link></li>
              <li><Link href="/#" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} MouNa Monitoring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
