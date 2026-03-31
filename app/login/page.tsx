import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { login } from "@/lib/actions/auth";
import Image from "next/image";

function errorMessage(code?: string) {
  switch (code) {
    case "missing_email":
      return "Please enter your email.";
    case "missing_password":
      return "Please enter your password.";
    case "invalid_credentials":
      return "Invalid email or password.";
    default:
      return null;
  }
}

export default async function LoginPage({
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
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message ? (
              <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {message}
              </div>
            ) : null}
            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                  {/* <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link> */}
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button className="w-full" type="submit">Log in</Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              {/* <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">Or continue with</span>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full gap-2 text-sm font-medium">
                Google
              </Button>
              <Button variant="outline" className="w-full gap-2 text-sm font-medium">
                GitHub
              </Button>
            </div> */}
          </CardContent>
          {/* <CardFooter className="flex justify-center flex-col gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
}
