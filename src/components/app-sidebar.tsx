import { useLocation, useNavigate } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton className="gap-x-4 h-12 px-4 border-b border-border/50">
            <span className="flex items-center gap-3 font-semibold text-primary">
              <img src="/logo.svg" className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide text-foreground">
                Magenta Insights
              </span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/70 tracking-wider">
              {group.title}
            </SidebarGroupLabel>
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
                      onClick={() => {
                        navigate(item.url);
                      }}
                    >
                      <item.icon strokeWidth={1.7} className="size-4 shrink-0" />
                      <span className="">{item.title}</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <SidebarMenuButton
                  tooltip={currentUser?.name || "Shreyas Gadave"}
                  className="gap-x-4 h-10 px-4 w-full"
                >
                  <CircleUserRound strokeWidth={1.7} className="h-4 w-4 shrink-0" />
                  <span className="truncate text-left">{currentUser?.name || "Shreyas Gadave"}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-56 font-[Outfit] border border-border/40 ml-2"
              >
                <div className="flex flex-col p-2 text-xs">
                  <span className="font-semibold text-foreground">{currentUser?.name || "Shreyas Gadave"}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{currentUser?.email || "shreyasgadave777@gmail.com"}</span>
                </div>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully!");
                    navigate("/signin");
                  }}
                  variant="destructive"
                  className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-3.5 w-3.5 text-destructive" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
