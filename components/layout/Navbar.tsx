import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="MouNa Monitoring" width={64} height={64} />
        </Link>
        {/*         
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/status/demo" className="hover:text-primary transition-colors">
            Status Page
          </Link>
        </nav> */}

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300">
            Login
          </Link>
          {/* <Link href="/signup">
            <Button>Sign Up</Button>
          </Link> */}
        </div>
      </div>
    </header>
  );
}
