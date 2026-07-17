
export type OutletStatus = "Active" | "Inactive" | "Prospect";

export interface Outlet {
  id: number;
  outletName: string;
  ownerName: string;
  contact: string;
  address: string;
  latitude: number;
  longitude: number;
  status: OutletStatus;
  lastVisit: string; // ISO date string, e.g. "2026-07-15"
}