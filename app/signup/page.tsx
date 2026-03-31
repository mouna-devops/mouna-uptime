import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { signup } from "@/lib/actions/auth";
import Image from "next/image";

function errorMessage(code?: string) {
  switch (code) {
    case "missing_email":
      return "Please enter your email.";
    case "weak_password":
      return "Password must be at least 8 characters.";
    case "email_in_use":
      return "An account with this email already exists.";
    default:
      return null;
  }
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const error = typeof sp.error === "string" ? sp.error : undefined;
  const message = errorMessage(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center gap-2 mb-8">
         <Image src="/logo.png" alt="MouNa Monitoring" width={64} height={64} />
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your free account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message ? (
              <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {message}
              </div>
            ) : null}
            <form action={signup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                <Input id="name" name="name" type="text" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                <Input id="password" name="password" type="password" required minLength={8} />
              </div>
              <Button className="w-full" type="submit">Create Account</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
