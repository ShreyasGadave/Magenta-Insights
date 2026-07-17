import { useLocation, useNavigate } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CircleUserRound,
  LayoutDashboard,
  Store,
  Settings,
  Map as MapIcon,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "MANAGE",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
      {
        title: "Outlets",
        icon: Store,
        url: "/outlets",
      },
      {
        title: "Map",
        icon: MapIcon,
        url: "/map",
      },
      {
        title: "Settings",
        icon: Settings,
        url: "/settings",
      },
    ],
  },
];

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useOutlets();

  const displayName = currentUser?.name || "Shreyas Gadave";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton className="gap-x-4 h-12 px-4 border-b border-border/50">
            <span className="flex items-center gap-3 font-semibold text-primary">
              <div className="flex items-center justify-center size-7 rounded-lg bg-primary text-primary-foreground font-extrabold text-sm shadow-md shadow-primary/20">
                M
              </div>
              <span className="text-sm font-[Outfit] tracking-wide text-foreground">Magenta Insights</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/70 tracking-wider">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      className="gap-x-4 h-10 px-4 rounded-xl transition-all duration-200"
                      onClick={() => {
                        navigate(item.url);
                      }}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-x-3 px-3 py-2 rounded-xl bg-accent/30 border border-border/10">
                <CircleUserRound className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-semibold text-foreground leading-none">{displayName}</span>
                  <span className="truncate text-[10px] text-muted-foreground mt-0.5">{currentUser?.email || "admin@magenta.com"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/signin");
                }}
                className="flex w-full items-center gap-x-3 h-9 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
