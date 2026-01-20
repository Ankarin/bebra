"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your observability settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Notifications</CardTitle>
          <CardDescription>
            Receive alerts when errors or anomalies are detected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook"
                placeholder="https://your-server.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button>Save</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll POST events to this URL when they occur.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>
            Configure when to trigger alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="errorRate">Error Rate Threshold (%)</Label>
              <Input id="errorRate" type="number" placeholder="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latency">Latency Threshold (ms)</Label>
              <Input id="latency" type="number" placeholder="5000" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>
            Configure how long to keep your logs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retention">Retention Period (days)</Label>
            <Input id="retention" type="number" placeholder="30" className="max-w-[200px]" />
            <p className="text-sm text-muted-foreground">
              Logs older than this will be automatically deleted.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
            <div>
              <p className="font-medium">Delete All Logs</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all stored logs and metrics.
              </p>
            </div>
            <Button variant="destructive">Delete All</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
