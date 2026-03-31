"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Globe, Lock, Plus, Search, ExternalLink, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { getStatusPages, createStatusPage, deleteStatusPage } from "@/lib/actions/status-page";
import { getMonitors } from "@/lib/actions/monitor";

export default function StatusPagesSettings() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    const [pData, mData] = await Promise.all([getStatusPages(), getMonitors()]);
    setPages(pData);
    setMonitors(mData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStatusPage({ name, domain, isPublic, monitorIds: selectedMonitors });
    setIsAddModalOpen(false);
    setName("");
    setDomain("");
    setSelectedMonitors([]);
    loadData();
  };

  const toggleMonitorSelection = (id: string) => {
    setSelectedMonitors(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Status Pages</h1>
          <p className="text-gray-500 dark:text-gray-400">Create beautifully designed status pages to loop your customers in.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> New Status Page
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-gray-500">Loading status pages...</div>}
        {!loading && pages.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800">No status pages created yet. Click "New Status Page" to start.</div>}
        {!loading && pages.map((page) => (
          <Card key={page.id} className="flex flex-col overflow-hidden">
            <div className={`h-2 w-full ${page.isPublic ? "bg-success" : "bg-gray-400"}`}></div>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="truncate">{page.name}</CardTitle>
                {page.isPublic ? (
                  <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
                    <Globe className="mr-1 h-3 w-3" /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400">
                    <Lock className="mr-1 h-3 w-3" /> Private
                  </span>
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Activity className="h-3 w-3" /> {page.monitors.length} monitors
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto bg-gray-50 p-4 dark:bg-gray-900/50 flex justify-between gap-2">
              <div className="flex gap-2 w-full">
                <Link href={`/status/${page.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    <ExternalLink className="h-3 w-3" /> View
                  </Button>
                </Link>
                <Button variant="danger" className="px-3" onClick={async () => {
                  if(confirm("Delete status page?")) {
                    await deleteStatusPage(page.id);
                    loadData();
                  }
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Status Page">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Name</label>
            <Input placeholder="e.g., System Status" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Domain (Optional)</label>
            <Input placeholder="status.yourdomain.com" value={domain} onChange={e => setDomain(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-1 block">Select Monitors to Include</label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 dark:border-gray-700 space-y-2">
              {monitors.length === 0 ? <p className="text-sm text-gray-500">No monitors found.</p> : monitors.map(m => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                   <input type="checkbox" checked={selectedMonitors.includes(m.id)} onChange={() => toggleMonitorSelection(m.id)} className="rounded border-gray-300" />
                   {m.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="visibility" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded border-gray-300" />
            <label htmlFor="visibility" className="text-sm">Make page publicly visible</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Page</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
