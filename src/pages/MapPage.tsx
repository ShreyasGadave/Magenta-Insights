import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useOutlets } from "@/context/OutletContext";
import { useTheme } from "@/components/theme-provider";
import type { Outlet, OutletStatus } from "@/types/outlet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Phone,
  User,
  Calendar,
  Navigation,
  ArrowRight,
  Filter,
} from "lucide-react";

// Default coordinate center (Pune, India)
const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567];
const DEFAULT_ZOOM = 12;

// Custom Marker Generator utilizing L.divIcon for modern vector indicators (with glow animation)
const createStatusMarkerIcon = (status: OutletStatus, isActive: boolean) => {
  const styles = {
    Active: {
      color: "text-emerald-500",
      bg: "bg-emerald-500",
      shadow: "shadow-emerald-500/50",
    },
    Inactive: {
      color: "text-neutral-500",
      bg: "bg-neutral-500",
      shadow: "shadow-neutral-500/50",
    },
    Prospect: {
      color: "text-amber-500",
      bg: "bg-amber-500",
      shadow: "shadow-amber-500/50",
    },
  }[status];

  const size = isActive ? "w-5 h-5" : "w-3.5 h-3.5";
  const pinSize = isActive ? "w-6 h-6" : "w-4 h-4";

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        ${
          status !== "Inactive"
            ? `<div class="absolute ${pinSize} rounded-full ${styles.bg} bg-current opacity-25 animate-ping"></div>`
            : ""
        }
        <div class="relative ${size} rounded-full border-2 border-white dark:border-zinc-900 shadow-md ${styles.bg} bg-current transition-all duration-300"></div>
      </div>
    `,
    className: "custom-leaflet-marker-wrapper",
    iconSize: isActive ? [24, 24] : [16, 16],
    iconAnchor: isActive ? [12, 12] : [8, 8],
  });
};

// Map Controller Component to programmatically transition viewport center & zoom
interface MapControllerProps {
  center: [number, number] | null;
  zoom: number;
}
const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [center, zoom, map]);
  return null;
};

const MapPage: React.FC = () => {
  const { outlets } = useOutlets();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selection state for panning/focusing
  const [activeOutlet, setActiveOutlet] = useState<Outlet | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Auto-resolve system theme for map tile dark mode
  const activeTheme = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  // CartoDB Tile selection: Sleek minimal maps matching system theme
  const tileUrl = useMemo(() => {
    return activeTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  }, [activeTheme]);

  // Filtered list of outlets on map
  const filteredOutlets = useMemo(() => {
    return outlets.filter((outlet) => {
      const term = search.toLowerCase();
      const matchesSearch =
        outlet.outletName.toLowerCase().includes(term) ||
        outlet.ownerName.toLowerCase().includes(term) ||
        outlet.address.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || outlet.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [outlets, search, statusFilter]);

  // Zoom and pan to a specific outlet
  const focusOnOutlet = (outlet: Outlet) => {
    setActiveOutlet(outlet);
    setMapCenter([outlet.latitude, outlet.longitude]);
    setMapZoom(15);
  };

  // Helper styles for status badge
  const getBadgeStyle = (status: OutletStatus) => {
    if (status === "Active") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (status === "Inactive") return "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20";
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden w-full font-sans">
      {/* Side Control panel */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border/40 bg-card flex flex-col h-[40%] md:h-full shrink-0 shadow-sm z-10">
        <div className="p-4 border-b border-border/30 flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-medium">Outlet Map</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Geographic lookup and tracking of field coverage.
            </p>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search outlets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl bg-background/50 border-border/60"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="h-3 w-3 text-muted-foreground mr-1 shrink-0" />
            {["All", "Active", "Inactive", "Prospect"].map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                className="text-[10px] h-7 px-2.5 rounded-lg font-bold shadow-none shrink-0"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/20">
          {filteredOutlets.map((outlet) => {
            const isSelected = activeOutlet?.id === outlet.id;
            return (
              <div
                key={outlet.id}
                onClick={() => focusOnOutlet(outlet)}
                className={`p-3.5 text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-accent/40 border-l-4 border-l-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-xs text-foreground truncate max-w-[180px] sm:max-w-xs block">
                    {outlet.outletName}
                  </span>
                  <Badge
                    variant={
                      outlet.status === "Active"
                        ? "default"
                        : outlet.status === "Inactive"
                        ? "secondary"
                        : "outline"
                    }
                    className={`text-[9px] px-1.5 py-0 rounded-full border shrink-0 ${getBadgeStyle(
                      outlet.status
                    )}`}
                  >
                    {outlet.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  Owner: {outlet.ownerName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {outlet.address}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                  <span className="font-mono text-[9px] text-muted-foreground leading-none">
                    {outlet.latitude.toFixed(4)}, {outlet.longitude.toFixed(4)}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-primary flex items-center gap-0.5 leading-none">
                      Active Map Node <Navigation className="h-2.5 w-2.5 fill-current" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredOutlets.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching outlets.
            </div>
          )}
        </div>
      </div>

      {/* Map component */}
      <div className="flex-1 h-[60%] md:h-full relative w-full bg-accent/10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          zoomControl={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {filteredOutlets.map((outlet) => {
            const isSelected = activeOutlet?.id === outlet.id;
            return (
              <Marker
                key={outlet.id}
                position={[outlet.latitude, outlet.longitude]}
                icon={createStatusMarkerIcon(outlet.status, isSelected)}
                eventHandlers={{
                  click: () => {
                    setActiveOutlet(outlet);
                    setMapCenter([outlet.latitude, outlet.longitude]);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 min-w-[200px] text-xs font-sans">
                    <div className="flex justify-between items-start gap-2 mb-1.5 border-b border-border/10 pb-1.5">
                      <span className="font-bold text-foreground text-sm truncate max-w-[140px]">
                        {outlet.outletName}
                      </span>
                      <Badge
                        variant={
                          outlet.status === "Active"
                            ? "default"
                            : outlet.status === "Inactive"
                            ? "secondary"
                            : "outline"
                        }
                        className={`text-[9px] px-1.5 rounded-full border shrink-0 ${getBadgeStyle(
                          outlet.status
                        )}`}
                      >
                        {outlet.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{outlet.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-mono">{outlet.contact}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{outlet.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Visited: {outlet.lastVisit}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/10">
                      <Button
                        size="sm"
                        className="w-full text-[10px] font-bold h-7 gap-1 rounded-lg"
                        onClick={() => navigate(`/outlets?id=${outlet.id}`)}
                      >
                        Inspect Full Profile <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
