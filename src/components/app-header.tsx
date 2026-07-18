import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

const AppHeader = () => {
  return (
    <header className="flex justify-between h-14 shrink-0 items-center  gap-2 border-b px-4 bg-background">
      <SidebarTrigger />  
      <ModeToggle />
    </header>
  );
};

export default AppHeader;
