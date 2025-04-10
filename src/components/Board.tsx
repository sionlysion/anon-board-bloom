
import React, { useState } from "react";
import Thread from "./Thread";
import ThreadForm from "./ThreadForm";
import { Button } from "@/components/ui/button";

// Mock data for initial threads
const MOCK_THREADS = [
  {
    id: "12345678",
    title: "Welcome to Anon Board",
    posts: [
      {
        id: "12345678",
        name: "Admin",
        content: "Welcome to Anon Board! This is a simple 4chan-like message board.\n\nRules:\n>Be respectful\n>No illegal content\n>Have fun!",
        timestamp: "04/10/25(Fri)12:34:56",
        isOP: true,
      },
      {
        id: "12345679",
        name: "",
        content: "First reply. How does this work?",
        timestamp: "04/10/25(Fri)12:35:23",
      },
      {
        id: "12345680",
        name: "Helper",
        content: ">>12345679\nJust like that! You can reply to posts using the format >>postID.",
        timestamp: "04/10/25(Fri)12:37:45",
      },
    ],
  },
  {
    id: "12345681",
    title: "Thread about cats",
    posts: [
      {
        id: "12345681",
        name: "Cat Lover",
        content: "What's your favorite cat breed? Mine is Scottish Fold.",
        timestamp: "04/10/25(Fri)14:22:31",
        isOP: true,
      },
      {
        id: "12345682",
        name: "",
        content: ">not liking Maine Coons\nAnon, I...",
        timestamp: "04/10/25(Fri)14:25:12",
      },
    ],
  },
];

const Board: React.FC = () => {
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [showThreadForm, setShowThreadForm] = useState(false);

  return (
    <div className="board">
      <div className="board-header flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">/b/ - Random</h1>
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

export default Board;
