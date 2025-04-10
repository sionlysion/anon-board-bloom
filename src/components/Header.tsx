
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  currentBoard?: "random" | "technology" | "anime";
}

const Header: React.FC<HeaderProps> = ({ currentBoard = "random" }) => {
  return (
    <header className="border-b border-border py-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            <Link to="/" className="hover:opacity-80">AnonBoard</Link>
          </h1>
          <nav className="flex gap-2 text-sm">
            <Link 
              to="/" 
              className={`hover:underline ${currentBoard === "random" ? "font-semibold" : ""}`}
            >
              /b/ - Random
            </Link>
            <Link 
              to="/g" 
              className={`hover:underline ${currentBoard === "technology" ? "font-semibold" : ""}`}
            >
              /g/ - Technology
            </Link>
            <Link 
              to="/a" 
              className={`hover:underline ${currentBoard === "anime" ? "font-semibold" : ""}`}
            >
              /a/ - Anime
            </Link>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
