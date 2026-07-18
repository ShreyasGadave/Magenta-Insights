// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppHeader from "@/components/app-header";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarInset className="bg-background">
          <AppHeader />
          <main className="flex flex-col flex-1 overflow-auto"><Outlet /></main>
        </SidebarInset>
      </SidebarProvider>
  );
}
