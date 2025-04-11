
import React, { useState, useEffect } from "react";
import Thread from "./Thread";
import ThreadForm from "./ThreadForm";
import { Button } from "@/components/ui/button";
import { useDb } from "@/lib/DbContext";
import { Thread as ThreadType, Post as PostType } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";
import { PostData } from "./Thread";

interface BoardThreadType {
  id: string;
  title?: string;
  posts: PostData[];
}

interface BoardProps {
  boardType?: "random" | "technology" | "anime";
}

const Board: React.FC<BoardProps> = ({ boardType = "random" }) => {
  const [threads, setThreads] = useState<BoardThreadType[]>([]);
  const [showThreadForm, setShowThreadForm] = useState(false);
  const { loadThreads, getThreadWithPosts } = useDb();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Load threads for this board
  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const boardThreads = await loadThreads(boardType);
        
        // For each thread, load its posts
        const threadsWithPosts = await Promise.all(
          boardThreads.map(async (thread) => {
            const threadData = await getThreadWithPosts(thread.id);
            if (!threadData) return null;
            
            return {
              id: thread.id,
              title: thread.title,
              posts: threadData.posts.map(post => ({
                id: post.id,
                content: post.content,
                name: post.name,
                timestamp: post.timestamp,
                isOP: post.is_op
              }))
            };
          })
        );
        
        setThreads(threadsWithPosts.filter(Boolean) as BoardThreadType[]);
      } catch (error) {
        console.error("Error loading threads:", error);
        toast({
          title: "Error",
          description: "Failed to load threads",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [boardType]);

  const getBoardTitle = () => {
    switch (boardType) {
      case "technology":
        return "/g/ - Technology";
      case "anime":
        return "/a/ - Anime";
      default:
        return "/b/ - Random";
    }
  };

  return (
    <div className="board">
      <div className="board-header flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{getBoardTitle()}</h1>
        <Button 
          onClick={() => setShowThreadForm(!showThreadForm)}
          variant="secondary"
          size="sm"
        >
          {showThreadForm ? "Cancel" : "New Thread"}
        </Button>
      </div>

      {showThreadForm && (
        <ThreadForm 
          onCancel={() => setShowThreadForm(false)} 
          boardType={boardType}
          onThreadCreated={(newThread) => {
            setThreads(prev => [newThread, ...prev]);
            setShowThreadForm(false);
          }}
        />
      )}

      <div className="threads space-y-8">
        {loading ? (
          <div className="text-center py-10">Loading threads...</div>
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <Thread key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="text-center py-10">No threads found. Be the first to create one!</div>
        )}
      </div>
    </div>
  );
};

export default Board;
