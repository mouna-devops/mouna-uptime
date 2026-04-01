"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, XCircle, Search, Plus, Play, Pause, Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { getMonitors, createMonitor, deleteMonitor, toggleMonitorStatus } from "@/lib/actions/monitor";

export default function MonitorsList() {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("HTTP(S)");
  const [interval, setInterval] = useState("1");
  const [timeout, setTimeoutVal] = useState("30");
  const [saving, setSaving] = useState(false);

  const loadMonitors = async () => {
    setLoading(true);
    const data = await getMonitors();
    setMonitors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  const filteredMonitors = monitors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createMonitor({ name, url, type, interval: parseInt(interval), timeout: parseInt(timeout) });
    setIsAddModalOpen(false);
    setName("");
    setUrl("");
    setSaving(false);
    loadMonitors();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and view all your active monitors.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add Monitor
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Name / URL</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Response Time</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading monitors...
                  </td>
                </tr>
              )}
              {!loading && filteredMonitors.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {monitor.status === "up" && <CheckCircle className="h-5 w-5 text-success" />}
                      {monitor.status === "degraded" && <AlertTriangle className="h-5 w-5 text-warning" />}
                      {monitor.status === "down" && <XCircle className="h-5 w-5 text-danger" />}
                      {monitor.status === "paused" && <Pause className="h-5 w-5 text-gray-400 fill-current" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/monitors/${monitor.id}`} className="font-medium text-primary hover:underline">
                      {monitor.name}
                    </Link>
                    <div className="text-xs text-gray-500 max-w-[200px] truncate" title={monitor.url}>
                      {monitor.url}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {monitor.type}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {monitor.interval} min
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {monitor.checks?.length > 0 ? `${monitor.checks[0].responseTime}ms` : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={async () => {
                        await toggleMonitorStatus(monitor.id, monitor.status);
                        loadMonitors();
                      }} className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md dark:hover:bg-gray-800 transition-colors" title={monitor.status === "paused" ? "Play" : "Pause"}>
                        {monitor.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </button>
                      <button onClick={async () => {
                        await deleteMonitor(monitor.id);
                        loadMonitors();
                      }} className="p-1.5 text-gray-500 hover:text-danger hover:bg-gray-100 rounded-md dark:hover:bg-gray-800 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredMonitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No monitors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Monitor">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Monitor Name</label>
            <Input placeholder="e.g., Production API" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL to Monitor</label>
            <Input placeholder="https://api.example.com" type="url" required value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900">
                <option>HTTP(S)</option>
                <option>Ping</option>
                <option>Port / TCP</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check Interval</label>
              <select value={interval} onChange={e => setInterval(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900">
                <option value="1">1 Minute</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeout (Seconds)</label>
              <Input type="number" min="1" max="60" value={timeout} onChange={e => setTimeoutVal(e.target.value)} required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </span>
              ) : "Create Monitor"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
