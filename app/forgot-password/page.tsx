import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              MouNa<span className="text-primary">Monitoring</span>
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
            <CardDescription>
              Enter your email address to get a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <Link href="/reset-password" className="w-full inline-block">
              <Button className="w-full">Send Reset Link</Button>
            </Link>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary flex items-center gap-2 font-medium">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
