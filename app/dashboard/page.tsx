"use client";

import React, { useEffect, useState } from "react";
import { Activity, ArrowUpRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getMonitors, getRecentIncidents, getDashboardStats } from "@/lib/actions/monitor";

export default function DashboardOverview() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [stats, setStats] = useState({ uptime30d: "100.00", trendData: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [m, i, s] = await Promise.all([getMonitors(), getRecentIncidents(), getDashboardStats()]);
      setMonitors(m);
      setIncidents(i);
      setStats(s);
      setLoading(false);
    };
    loadData();
  }, []);

  const upCount = monitors.filter(m => m.status === 'up').length;
  const downCount = monitors.filter(m => m.status === 'down').length;

  // We now fetch actual data dynamically via stats.trendData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your monitors today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : monitors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Up Monitors</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{loading ? "..." : upCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Down Monitors</CardTitle>
            <XCircle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{loading ? "..." : downCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime (30d)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : `${stats.uptime30d}%`}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Uptime Trends</CardTitle>
            <CardDescription>Average uptime over the last hours</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loading ? [] : stats.trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} domain={['dataMin - 1', 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="uptime" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest incidents across all monitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500 text-center py-4">Loading incidents...</div>
              ) : incidents.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  <CheckCircle className="h-8 w-8 text-success/50 mx-auto mb-2" />
                  No recent incidents recorded! All good.
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="flex items-start gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${inc.status === 'resolved' ? 'bg-success/10' : 'bg-danger/10'}`}>
                      {inc.status === 'resolved' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-danger" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{inc.errorType || "Offline Alert"}</p>
                      <p className="text-xs text-gray-500">
                        {inc.monitor?.name} &bull; {new Date(inc.startedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
