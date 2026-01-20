import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function HomePage() {
  const authed = await isAuthenticated();

  if (authed) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Glaife</h1>
          <p className="mt-2 text-muted-foreground">
            Security and observability for AI agents
          </p>
        </div>

        <LoginForm />

        <div className="space-y-4 text-sm">
          <p className="text-center text-muted-foreground">
            Open source. Self-hostable.
          </p>
        </div>
      </div>
    </div>
  );
}
