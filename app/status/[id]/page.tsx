import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Activity, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

// To use async in page components cleanly in Next.js 16/React 19, we must await the params.
export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const statusPage = await db.statusPage.findUnique({
    where: { id },
    include: {
      monitors: {
        where: { status: { not: "paused" } },
        include: {
          checks: { orderBy: { createdAt: "desc" }, take: 1 }
        }
      }
    }
  });

  if (!statusPage) {
    return notFound();
  }

  const monitors = statusPage.monitors;
  const allOperational = monitors.every((m: any) => m.status === "up");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 dark:bg-gray-900 border dark:border-gray-800">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{statusPage.name}</h1>
          <p className="text-gray-500 mt-2 dark:text-gray-400">Current status of all systems and services.</p>
        </div>

        {/* Global Status Banner */}
        {monitors.length > 0 ? (
          <div className={`rounded-xl p-6 mb-8 text-white shadow-lg ${
            allOperational ? "bg-success" : "bg-warning text-gray-900"
          }`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              {allOperational ? (
                <CheckCircle className="h-8 w-8 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-8 w-8 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
                </h2>
                <p className="opacity-90 mt-1">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-6 mb-8 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow flex items-center gap-4">
            <LayoutTemplate className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">No monitors attached</h2>
              <p className="mt-1 text-sm">This status page currently has no active monitors to display.</p>
            </div>
          </div>
        )}

        {/* Monitors List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Live real-time monitoring results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monitors.map((monitor) => {
                const latestRt = monitor.checks.length > 0 ? monitor.checks[0].responseTime : 0;
                return (
                  <div key={monitor.id} className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-4 last:border-0 last:pb-0 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      {monitor.status === "up" && <CheckCircle className="h-5 w-5 text-success" />}
                      {monitor.status === "degraded" && <AlertTriangle className="h-5 w-5 text-warning" />}
                      {monitor.status === "down" && <XCircle className="h-5 w-5 text-danger" />}
                      <span className="font-medium text-gray-900 dark:text-gray-100">{monitor.name}</span>
                    </div>
                    <div className="text-right flex flex-row items-center gap-6">
                      <span className="text-sm text-gray-500">
                        {latestRt > 0 ? `${latestRt}ms` : "N/A"}
                      </span>
                      <span className={`text-sm font-semibold ${
                        monitor.status === "up" ? "text-success" : monitor.status === "degraded" ? "text-warning" : "text-danger"
                      }`}>
                        {monitor.status === "up" ? "Operational" : monitor.status === "degraded" ? "Degraded" : "Outage"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by <span className="font-semibold text-primary">MouNa Monitoring</span></p>
        </div>
      </div>
    </div>
  );
}
