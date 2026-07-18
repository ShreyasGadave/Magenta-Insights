import React, { useState } from "react";
import { useOutlets } from "@/context/OutletContext";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  Monitor,
  Database,
  User,
  Shield,
  RefreshCw,
  Save,
} from "lucide-react";

const Settings: React.FC = () => {
  const { currentUser, resetData, outlets } = useOutlets();
  const { theme, setTheme } = useTheme();

  // Mock form state for profile info
  const [profileName, setProfileName] = useState(currentUser?.name || "Shreyas Gadave");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "shreyasgadave777@gmail.com");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile mock settings saved successfully!");
  };

  const handleResetDatabase = () => {
    if (window.confirm("Are you sure you want to reset all outlet changes back to initial mock data? This will clear any additions, modifications, or deletions.")) {
      resetData();
      toast.success("Outlets database re-seeded successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Adjust preferences, profile options, and manage local database states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="border border-border/40 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold font-[Outfit]">User Profile</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Manage public details and account configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Name</label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="h-10 text-xs rounded-xl bg-background/50 border-border/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="h-10 text-xs rounded-xl bg-background/50 border-border/60"
                  />
                </div>
              </div>  
            </form>
          </CardContent>
        </Card>

        {/* Preferences / Theme */}
        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-[Outfit] flex items-center gap-2">
              Appearance
            </CardTitle>
            <CardDescription className="text-xs">
              Configure system theme and display settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block mb-2">Display Theme</span>
              <div className="grid grid-cols-3 gap-2">
                {/* Light */}
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 border text-xs font-semibold transition-all ${
                    theme === "light"
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </button>

                {/* Dark */}
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center gap-2 p-3  border text-xs font-semibold transition-all ${
                    theme === "dark"
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </button>

                {/* System */}
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 border text-xs font-semibold transition-all ${
                    theme === "system"
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
