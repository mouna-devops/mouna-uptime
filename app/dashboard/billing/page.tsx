"use client";

import React from "react";
import { CheckCircle, CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const invoices = [
  { id: "INV-2023-01", date: "Oct 01, 2023", amount: "$19.00", status: "Paid" },
  { id: "INV-2023-02", date: "Sep 01, 2023", amount: "$19.00", status: "Paid" },
  { id: "INV-2023-03", date: "Aug 01, 2023", amount: "$19.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your plan and billing details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Pro plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6 dark:border-gray-800">
              <div>
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  Pro <span className="text-base font-normal text-gray-500 dark:text-gray-400">$19 / month</span>
                </h3>
                <p className="text-sm text-gray-500 mt-2">Renews on Nov 01, 2023</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Monitors Limit</span>
                  <span className="text-gray-500">12 / 50</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">SMS Credits</span>
                  <span className="text-gray-500">25 / 100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 rounded-b-xl">
            <Button variant="outline">Cancel Plan</Button>
            <Button>Upgrade Plan</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4 flex items-center gap-4">
              <div className="h-10 w-14 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">Update Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your previous invoices.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300 border-y border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium dark:text-gray-200">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md dark:hover:bg-gray-800 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
