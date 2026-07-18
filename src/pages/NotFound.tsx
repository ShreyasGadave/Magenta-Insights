import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-bold text-primary">404</h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-muted-foreground mt-2">
        The page you're looking for doesn't exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-primary px-6 py-2 text-white hover:opacity-90"
      >
        Go to Home
      </button>

      <p className="mt-4 text-sm text-muted-foreground">
        Redirecting to Home in 5 seconds...
      </p>
    </div>
  );
};

export default NotFound;