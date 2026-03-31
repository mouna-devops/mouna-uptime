"use client";

import React, { useState, useEffect } from "react";
import { Webhook, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { getAlertContacts, createAlertContact, deleteAlertContact, toggleAlertContact } from "@/lib/actions/alert";

export default function AlertsSettings() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    const data = await getAlertContacts();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createAlertContact({ type: "Webhook", value });
      setIsAddModalOpen(false);
      setValue("");
      loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add webhook");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alert Contacts</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure who gets notified when a monitor goes down.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>We'll send alerts to these channels during downtime.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <div className="text-center py-4 text-gray-500">Loading contacts...</div>}
            {!loading && contacts.length === 0 && (
              <div className="text-center py-6 text-gray-500">No alert channels configured.</div>
            )}
            {!loading && contacts.map((contact) => (
              <div key={contact.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Webhook className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Webhook</p>
                    <p className="text-sm text-gray-500 break-all">{contact.value}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={contact.enabled} 
                      onChange={async () => {
                        await toggleAlertContact(contact.id, contact.enabled);
                        loadContacts();
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                  <button onClick={async () => {
                    if(confirm("Delete contact?")) {
                      await deleteAlertContact(contact.id);
                      loadContacts();
                    }
                  }} className="p-2 text-gray-400 hover:text-danger rounded-md hover:bg-danger/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Notification Channel">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL</label>
            <Input 
              placeholder="https://example.com/webhooks/mouna" 
              required 
              value={value} 
              onChange={e => setValue(e.target.value)} 
            />
            {error ? (
              <p className="text-sm text-danger">{error}</p>
            ) : null}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Webhook</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
