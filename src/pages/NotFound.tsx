
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 border border-border bg-card max-w-md">
        <h1 className="text-2xl font-bold mb-4">404 Not Found</h1>
        <p className="mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <div className="text-xs text-muted-foreground mb-6">
          <code>{location.pathname}</code>
        </div>
        <Button asChild>
          <a href="/">Return to Board</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
