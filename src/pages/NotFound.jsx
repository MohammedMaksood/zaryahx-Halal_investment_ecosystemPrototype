
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="text-center px-4">
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-lavender opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-gradient">Not Found</div>
          </div>
        </div>
        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or h moved.
        </p>
        <Button className="bg-lavender hover:bg-lavender-dark" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
