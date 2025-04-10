
import React from "react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">AnonBoard</h1>
          <nav className="flex gap-2 text-sm">
            <a href="#" className="hover:underline">/b/ - Random</a>
            <a href="#" className="hover:underline">/g/ - Technology</a>
            <a href="#" className="hover:underline">/a/ - Anime</a>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
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
