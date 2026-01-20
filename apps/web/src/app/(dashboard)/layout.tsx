import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <DashboardHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
