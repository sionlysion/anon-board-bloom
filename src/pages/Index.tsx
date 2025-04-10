
import React, { useEffect } from "react";
import Board from "@/components/Board";
import TechnologyBoard from "@/components/TechnologyBoard";
import AnimeBoard from "@/components/AnimeBoard";
import Header from "@/components/Header";
import $ from "@/lib/jquery";
import { useLocation } from "react-router-dom";

interface IndexProps {
  board?: "random" | "technology" | "anime";
}

const Index: React.FC<IndexProps> = ({ board = "random" }) => {
  const location = useLocation();
  
  // Determine which board to display based on path
  const determineBoardType = () => {
    if (board === "technology" || location.pathname === "/g") {
      return "technology";
    } else if (board === "anime" || location.pathname === "/a") {
      return "anime";
    }
    return "random";
  };
  
  const boardType = determineBoardType();

  useEffect(() => {
    // Example of using jQuery
    $(document).ready(function() {
      console.log("jQuery is working! Document is ready");
      
      // You can use jQuery for DOM manipulation here
      $("body").on("click", ".greentext", function() {
        console.log("Greentext clicked:", $(this).text());
      });
    });
  }, []);

  const renderBoard = () => {
    switch (boardType) {
      case "technology":
        return <TechnologyBoard />;
      case "anime":
        return <AnimeBoard />;
      default:
        return <Board />;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-2">
      <Header currentBoard={boardType} />
      <main>
        {renderBoard()}
      </main>
      <footer className="mt-8 mb-4 text-center text-xs text-muted-foreground">
        <p>AnonBoard © 2025 - A simple 4chan-inspired message board</p>
      </footer>
    </div>
  );
};

export default Index;
