"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Globe, ArrowUpRight, Pause, Play, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getMonitor, toggleMonitorStatus, deleteMonitor, updateMonitor } from "@/lib/actions/monitor";
import { useRouter } from "next/navigation";

export default function MonitorDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [monitor, setMonitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editType, setEditType] = useState("HTTP(s)");
  const [editInterval, setEditInterval] = useState("5");
  const [editTimeout, setEditTimeout] = useState("30");

  const loadMonitor = async () => {
    setLoading(true);
    const data = await getMonitor(id);
    if (data) {
      setMonitor(data);
      setEditName(data.name);
      setEditUrl(data.url);
      setEditType(data.type);
      setEditInterval(data.interval.toString());
      setEditTimeout(data.timeout ? data.timeout.toString() : "30");
    }
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMonitor(id, {
      name: editName,
      url: editUrl,
      type: editType,
      interval: parseInt(editInterval, 10),
      timeout: parseInt(editTimeout, 10)
    });
    setIsEditModalOpen(false);
    loadMonitor();
  };

  useEffect(() => {
    loadMonitor();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading monitor details...</div>;
  }

  if (!monitor) {
    return <div className="p-8 text-center">Monitor not found.</div>;
  }

  // Formatting mock data for charts based on real db checks
  const uptimeData = monitor.checks.map((c: any) => ({
    time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    uptime: c.status === "up" ? 100 : 0
  })).reverse();

  const responseTimeData = monitor.checks.map((c: any) => ({
    time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rt: c.responseTime
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/dashboard/monitors" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Monitors
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              monitor.status === 'up' ? 'bg-success/10 text-success' : 
              monitor.status === 'down' ? 'bg-danger/10 text-danger' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {monitor.status === 'up' ? <CheckCircle className="mr-1 h-3 w-3" /> : null}
              {monitor.status.toUpperCase()}
            </span>
          </div>
          <a href={monitor.url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1">
            {monitor.url} <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={async () => {
            await toggleMonitorStatus(monitor.id, monitor.status);
            loadMonitor();
          }}>
            {monitor.status === "paused" ? <><Play className="h-4 w-4" /> Resume</> : <><Pause className="h-4 w-4" /> Pause</>}
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="h-4 w-4" /> Edit
          </Button>
          <Button variant="danger" className="gap-2" onClick={async () => {
            if (confirm("Are you sure you want to delete this monitor?")) {
              await deleteMonitor(monitor.id);
              router.push("/dashboard/monitors");
            }
          }}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-medium">Interval</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold mt-2">{monitor.interval} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-medium">Type</span>
              <Globe className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold mt-2">{monitor.type}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-medium">Avg. Response Time</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {responseTimeData.length > 0 ? 
                Math.round(responseTimeData.reduce((acc: number, val: any) => acc + val.rt, 0) / responseTimeData.length) + "ms" 
                : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-medium">Last Checked</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold mt-2 text-base">
              {monitor.checks.length > 0 ? new Date(monitor.checks[0].createdAt).toLocaleTimeString() : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uptime (Recent Checks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {uptimeData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No check data available yet. Waiting for cron job...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={uptimeData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis domain={['auto', 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="stepAfter" dataKey="uptime" stroke="var(--color-success)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time (Recent Checks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {responseTimeData.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">No check data available yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="rt" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Latest Incidents</CardTitle>
            <CardDescription>History of downtime and performance issues.</CardDescription>
          </CardHeader>
          <CardContent>
            {monitor.incidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p>No incidents recorded.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {monitor.incidents.map((incident: any) => (
                  <li key={incident.id} className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                     <div>
                        <p className="font-medium">{incident.errorType}</p>
                        <p className="text-sm text-gray-500">{new Date(incident.startedAt).toLocaleString()}</p>
                     </div>
                     <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                       incident.status === "resolved" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                     }`}>
                        {incident.status}
                     </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Monitor">
        <form className="space-y-4" onSubmit={handleEdit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Monitor Name</label>
            <Input placeholder="e.g., Main API" required value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL / IP</label>
            <Input placeholder="https://api.example.com" required value={editUrl} onChange={e => setEditUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monitor Type</label>
              <select value={editType} onChange={e => setEditType(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900">
                <option>HTTP(s)</option>
                <option>Ping</option>
                <option>Port</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check Interval</label>
              <select value={editInterval} onChange={e => setEditInterval(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900">
                <option value="1">Every 1 minute</option>
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every 1 hour</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeout (Seconds)</label>
              <Input type="number" min="1" max="60" value={editTimeout} onChange={e => setEditTimeout(e.target.value)} required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

