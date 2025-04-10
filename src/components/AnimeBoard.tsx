
import React, { useState } from "react";
import Thread from "./Thread";
import ThreadForm from "./ThreadForm";
import { Button } from "@/components/ui/button";

// Mock data for anime threads
const ANIME_THREADS = [
  {
    id: "12345685",
    title: "Welcome to Anime",
    posts: [
      {
        id: "12345685",
        name: "Admin",
        content: "Welcome to the Anime board! Discuss anime, manga, and related Japanese culture.\n\nPlease be respectful of others' tastes.",
        timestamp: "04/10/25(Fri)13:30:00",
        isOP: true,
      },
      {
        id: "12345686",
        name: "",
        content: "What's everyone watching this season?",
        timestamp: "04/10/25(Fri)13:35:12",
      },
      {
        id: "12345687",
        name: "Weeb",
        content: ">>12345686\nThe new Chainsaw Man season is pretty good so far.",
        timestamp: "04/10/25(Fri)13:40:23",
      },
    ],
  },
  {
    id: "12345688",
    title: "Best manga of 2025?",
    posts: [
      {
        id: "12345688",
        name: "Manga Reader",
        content: "Now that we're a few months into 2025, what's your top manga pick so far?",
        timestamp: "04/10/25(Fri)14:12:31",
        isOP: true,
      },
      {
        id: "12345689",
        name: "",
        content: ">not reading One Piece\nIt's still the GOAT after all these years",
        timestamp: "04/10/25(Fri)14:25:12",
      },
    ],
  },
];

const AnimeBoard: React.FC = () => {
  const [threads, setThreads] = useState(ANIME_THREADS);
  const [showThreadForm, setShowThreadForm] = useState(false);

  return (
    <div className="board">
      <div className="board-header flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">/a/ - Anime</h1>
        <Button 
          onClick={() => setShowThreadForm(!showThreadForm)}
          variant="secondary"
          size="sm"
        >
          {showThreadForm ? "Cancel" : "New Thread"}
        </Button>
      </div>

      {showThreadForm && (
        <ThreadForm onCancel={() => setShowThreadForm(false)} />
      )}

      <div className="threads">
        {threads.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
};

export default AnimeBoard;
