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
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-neutral-50 dark:bg-background/20 min-h-[calc(100vh-3.5rem)]">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold font-[Outfit] tracking-tight text-foreground">Settings</h1>
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
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Role / Permissions</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-[10px] font-bold py-0.5 rounded-lg flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Area Sales Manager
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold py-0.5 rounded-lg">
                    Level 3 Administrator
                  </Badge>
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" size="sm" className="font-semibold gap-1.5 rounded-xl shadow-sm">
                  <Save className="h-4 w-4" /> Save Profile Details
                </Button>
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
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
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
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
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
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
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

      {/* Database Management & Tools */}
      <Card className="border border-border/40 border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base font-semibold font-[Outfit] text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-xs text-destructive/80">
            Destructive actions and local storage database seeding.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-foreground">Reset Outlets Data Store</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              This action will reset the list of outlets back to the default state ({outlets.length} active records in memory). All added outlets and coordinate modifications will be discarded.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleResetDatabase}
            className="font-bold gap-1.5 rounded-xl shrink-0 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Reset Outlets Database
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
