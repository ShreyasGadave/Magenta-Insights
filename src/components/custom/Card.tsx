import React from "react";
import Data from "@/data/data";
import type { Outlet } from "@/types/outlet";
import OutletCard from "./Outletcard";

const Card: React.FC = () => {
  const handleView = (outlet: Outlet) => console.log("view", outlet.id);
  const handleEdit = (outlet: Outlet) => console.log("edit", outlet.id);
  const handleDelete = (outlet: Outlet) => console.log("delete", outlet.id);

  return (
    <div className="min-h-screen bg-neutral-100 py-5 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Optional Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Outlets
          </h1>
          <p className="text-neutral-600 mt-1">
            {Data.length} total outlets
          </p>
        </div>

        {/* Grid of Outlet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Data.map((outlet) => (
            <OutletCard
              key={outlet.id}
              outlet={outlet as Outlet}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;