"use client";

import { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KeysPage() {
  const [keys, setKeys] = useState<{ id: string; name: string; key: string; createdAt: string }[]>([]);

  const generateKey = () => {
    const newKey = {
      id: crypto.randomUUID(),
      name: `Key ${keys.length + 1}`,
      key: `glaife_${crypto.randomUUID().replace(/-/g, "")}`,
      createdAt: new Date().toISOString(),
    };
    setKeys([...keys, newKey]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for @glaife/ai
          </p>
        </div>
        <Button onClick={generateKey}>
          <Plus className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <code className="text-sm text-muted-foreground">
                      {key.key.substring(0, 20)}...
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(key.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setKeys(keys.filter((k) => k.id !== key.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { glaife } from '@glaife/ai';

glaife.init({
  apiKey: 'your-api-key-here',
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
