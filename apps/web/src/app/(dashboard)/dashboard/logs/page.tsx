import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logs</h1>
        <p className="text-muted-foreground">
          All agent activity and tool calls
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">All</Badge>
              <Badge variant="outline">Tool Calls</Badge>
              <Badge variant="outline">Errors</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No logs yet.</p>
            <p className="text-sm mt-2">
              Install @glaife/ai and wrap your tools to start logging.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
