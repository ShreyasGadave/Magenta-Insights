import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Outlets from "./pages/Outlets";
import MapPage from "./pages/MapPage";
import Settings from "./pages/Settings";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { OutletProvider } from "./context/OutletContext";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <OutletProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/outlets" element={<Outlets />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </OutletProvider>
  );
}

export default App;
