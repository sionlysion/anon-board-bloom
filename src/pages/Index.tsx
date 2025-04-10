
import React, { useEffect } from "react";
import Board from "@/components/Board";
import Header from "@/components/Header";
import $ from "@/lib/jquery";

const Index = () => {
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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-2">
      <Header />
      <main>
        <Board />
      </main>
      <footer className="mt-8 mb-4 text-center text-xs text-muted-foreground">
        <p>AnonBoard © 2025 - A simple 4chan-inspired message board</p>
      </footer>
    </div>
  );
};

export default Index;
