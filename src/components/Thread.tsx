
import React, { useState } from "react";
import Post from "./Post";
import ReplyForm from "./ReplyForm";
import { cn } from "@/lib/utils";

export interface PostData {
  id: string;
  content: string;
  name: string;
  timestamp: string;
  isOP?: boolean;
}

interface ThreadProps {
  thread: {
    id: string;
    title?: string;
    posts: PostData[];
  };
}

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const [expanded, setExpanded] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [posts, setPosts] = useState<PostData[]>(thread.posts || []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplyCreated = (newPost: PostData) => {
    setPosts(prev => [...prev, newPost]);
    setShowReplyForm(false);
  };

  const op = posts.find(post => post.isOP) || posts[0];

  return (
    <div className="thread border border-border p-4 rounded-md bg-card/50">
      <div className="thread-header flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleExpand} 
            className="text-xs text-muted-foreground"
          >
            [{expanded ? "-" : "+"}]
          </button>
          <span className="font-bold">
            {thread.title || "Anonymous Thread"} 
            <span className="text-muted-foreground ml-2">#{thread.id}</span>
          </span>
        </div>
        <button 
          onClick={toggleReplyForm} 
          className="text-xs border border-border px-2 py-1 bg-secondary hover:bg-muted"
        >
          Reply
        </button>
      </div>
      
      <div className={cn("thread-content", !expanded && "hidden")}>
        {showReplyForm && (
          <ReplyForm 
            threadId={thread.id} 
            onCancel={() => setShowReplyForm(false)}
            onReplyCreated={handleReplyCreated}
          />
        )}
        
        <div className="posts space-y-4">
          {posts.map((post) => (
            <Post 
              key={post.id} 
              post={post} 
              threadId={thread.id}
              onReply={() => setShowReplyForm(true)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thread;
