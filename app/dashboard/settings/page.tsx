"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getUser, updateUser } from "@/lib/actions/user";

export default function SettingsPage() {
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@example.com");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const user = await getUser();
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateUser({ name, email });
    setSaving(false);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal preferences and account security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading profile data...</p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-900/50 flex justify-end rounded-b-xl">
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings. (Mocked)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-900/50 flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center rounded-b-xl">
          <Button variant="outline" className="w-full sm:w-auto text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
            Enable Two-Factor Auth
          </Button>
          <Button disabled className="w-full sm:w-auto">Update Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Access your account via the REST API. (Mocked)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Production API Key</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input readOnly defaultValue="mouna_prod_8f92j3k..." className="font-mono bg-gray-50 dark:bg-gray-900 text-gray-500" />
              <Button variant="outline">Reveal</Button>
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/50 dark:border-danger/30">
        <CardHeader>
          <CardTitle className="text-danger">Danger Zone</CardTitle>
          <CardDescription>Permanently remove your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
