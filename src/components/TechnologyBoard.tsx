
import React, { useState } from "react";
import Thread from "./Thread";
import ThreadForm from "./ThreadForm";
import { Button } from "@/components/ui/button";

// Mock data for technology threads
const TECH_THREADS = [
  {
    id: "12345690",
    title: "Welcome to Technology",
    posts: [
      {
        id: "12345690",
        name: "Admin",
        content: "Welcome to the Technology board! Discuss hardware, software, programming, and all things tech.\n\nPlease keep discussions civil.",
        timestamp: "04/10/25(Fri)14:30:00",
        isOP: true,
      },
      {
        id: "12345691",
        name: "",
        content: "Any recommendations for programming languages to learn in 2025?",
        timestamp: "04/10/25(Fri)14:35:12",
      },
      {
        id: "12345692",
        name: "Dev",
        content: ">>12345691\nRust and TypeScript are still very relevant. WebAssembly is gaining momentum too.",
        timestamp: "04/10/25(Fri)14:40:23",
      },
    ],
  },
  {
    id: "12345693",
    title: "New CPU architectures",
    posts: [
      {
        id: "12345693",
        name: "Hardware Guy",
        content: "What do you think about the latest ARM developments?",
        timestamp: "04/10/25(Fri)15:12:31",
        isOP: true,
      },
      {
        id: "12345694",
        name: "",
        content: ">still using x86\nIt's time to move on anon",
        timestamp: "04/10/25(Fri)15:25:12",
      },
    ],
  },
];

const TechnologyBoard: React.FC = () => {
  const [threads, setThreads] = useState(TECH_THREADS);
  const [showThreadForm, setShowThreadForm] = useState(false);

  return (
    <div className="board">
      <div className="board-header flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">/g/ - Technology</h1>
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

export default TechnologyBoard;
