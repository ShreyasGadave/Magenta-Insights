import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Outlet, OutletStatus } from "@/types/outlet";

interface OutletCardProps {
  outlet: Outlet;
  onView?: (outlet: Outlet) => void;
  onEdit?: (outlet: Outlet) => void;
  onDelete?: (outlet: Outlet) => void;
}

const STATUS_STYLES: Record<
  OutletStatus,
  { stripe: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Active: { stripe: "bg-emerald-500", badgeVariant: "default" },
  Inactive: { stripe: "bg-neutral-400 dark:bg-neutral-600", badgeVariant: "secondary" },
  Prospect: { stripe: "bg-amber-500", badgeVariant: "outline" },
};

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const OutletCard: React.FC<OutletCardProps> = ({
  outlet,
  onView,
  onEdit,
  onDelete,
}) => {
  const style = STATUS_STYLES[outlet.status];
  const staleVisit = daysSince(outlet.lastVisit) > 21;

  return (
    <div className="flex bg-card border border-border/60 hover:border-border/100  overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[380px] font-sans">
      {/* Status Stripe */}
      <div className={`w-1.5 flex-shrink-0 ${style.stripe}`} />

      <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-base text-foreground truncate font-[Outfit]"
                title={outlet.outletName}
              >
                {outlet.outletName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
                {outlet.ownerName}
              </p>
            </div>

            <Badge
              variant={style.badgeVariant}
              className="flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              {outlet.status}
            </Badge>
          </div>

          {/* Address */}
          <p className="mt-3 text-xs text-foreground/80 leading-relaxed line-clamp-2 h-8">
            {outlet.address}
          </p>

          {/* Contact + Coordinates */}
          <div className="mt-3 bg-accent/30 border border-border/10 rounded-xl p-2.5 text-[11px] font-mono text-muted-foreground flex justify-between gap-2">
            <span className="font-semibold">{outlet.contact}</span>
            <span>
              {outlet.latitude.toFixed(4)}, {outlet.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Last Visit + Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-3 border-t border-border/10 gap-3">
          <div className="text-[10px] text-muted-foreground">
            Last visit{" "}
            <span
              className={`font-bold ${
                staleVisit ? "text-destructive" : "text-foreground"
              }`}
            >
              {formatDate(outlet.lastVisit)}
            </span>
            {staleVisit && <span className="text-destructive font-semibold"> (overdue)</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(outlet)}
              className="text-[10px] h-7 px-2 font-bold rounded-lg hover:bg-accent"
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(outlet)}
              className="text-[10px] h-7 px-2.5 font-bold rounded-lg border-border hover:bg-accent"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(outlet)}
              className="text-[10px] h-7 px-2.5 font-bold rounded-lg text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletCard;