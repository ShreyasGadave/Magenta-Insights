import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";

const Home: React.FC = () => {
  const { isAuthenticated } = useOutlets();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground font-extrabold text-lg shadow-md shadow-primary/20">
          M
        </div>
        <span className="font-[Outfit] text-sm font-bold text-muted-foreground">
          Loading Magenta Insights...
        </span>
      </div>
    </div>
  );
};

export default Home;