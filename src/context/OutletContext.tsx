import React, { createContext, useContext, useState, useEffect } from "react";
import type { Outlet } from "@/types/outlet";
import defaultData from "@/data/data";

interface User {
  name: string;
  email: string;
}

interface OutletContextType {
  outlets: Outlet[];
  isAuthenticated: boolean;
  currentUser: User | null;
  addOutlet: (outlet: Omit<Outlet, "id">) => void;
  updateOutlet: (id: number, updatedOutlet: Outlet) => void;
  deleteOutlet: (id: number) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  resetData: () => void;
}

const OutletContext = createContext<OutletContextType | undefined>(undefined);

export const OutletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load initial data from localStorage or fallback to defaults
  useEffect(() => {
    const storedOutlets = localStorage.getItem("magenta_outlets");
    if (storedOutlets) {
      try {
        setOutlets(JSON.parse(storedOutlets));
      } catch (e) {
        console.error("Error parsing outlets from localStorage", e);
        setOutlets(defaultData as Outlet[]);
      }
    } else {
      setOutlets(defaultData as Outlet[]);
      localStorage.setItem("magenta_outlets", JSON.stringify(defaultData));
    }

    const storedAuth = localStorage.getItem("magenta_auth");
    const storedUser = localStorage.getItem("magenta_user");
    if (storedAuth === "true" && storedUser) {
      try {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  // Save outlets to localStorage whenever they change
  const saveOutlets = (newOutlets: Outlet[]) => {
    setOutlets(newOutlets);
    localStorage.setItem("magenta_outlets", JSON.stringify(newOutlets));
  };

  const addOutlet = (outletData: Omit<Outlet, "id">) => {
    // Generate a unique ID (max ID + 1)
    const newId = outlets.length > 0 ? Math.max(...outlets.map((o) => o.id)) + 1 : 1;
    const newOutlet: Outlet = {
      ...outletData,
      id: newId,
    };
    const updated = [newOutlet, ...outlets];
    saveOutlets(updated);
  };

  const updateOutlet = (id: number, updatedOutlet: Outlet) => {
    const updated = outlets.map((o) => (o.id === id ? updatedOutlet : o));
    saveOutlets(updated);
  };

  const deleteOutlet = (id: number) => {
    const updated = outlets.filter((o) => o.id !== id);
    saveOutlets(updated);
  };

  const login = (email: string, name: string = "Shreyas Gadave") => {
    const user = { name, email };
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem("magenta_auth", "true");
    localStorage.setItem("magenta_user", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("magenta_auth");
    localStorage.removeItem("magenta_user");
  };

  const resetData = () => {
    saveOutlets(defaultData as Outlet[]);
  };

  return (
    <OutletContext.Provider
      value={{
        outlets,
        isAuthenticated,
        currentUser,
        addOutlet,
        updateOutlet,
        deleteOutlet,
        login,
        logout,
        resetData,
      }}
    >
      {children}
    </OutletContext.Provider>
  );
};

export const useOutlets = () => {
  const context = useContext(OutletContext);
  if (context === undefined) {
    throw new Error("useOutlets must be used within an OutletProvider");
  }
  return context;
};
