import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/signin" element={<Signup />} />
    </Routes>
  );
}

export default App;
