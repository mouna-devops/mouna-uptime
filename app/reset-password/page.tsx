import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ResetPasswordPage() {
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
            <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
            <CardDescription>
              Enter your new password below to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">New Password</label>
              <Input id="password" type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">Confirm Password</label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Link href="/login" className="w-full inline-block">
              <Button className="w-full">Reset Password</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
