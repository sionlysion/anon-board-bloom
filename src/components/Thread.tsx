
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
  replies?: PostData[];
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

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const op = thread.posts.find(post => post.isOP) || thread.posts[0];

  return (
    <div className="thread">
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
            <span className="text-muted-foreground">#{thread.id}</span>
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
          />
        )}
        
        <div className="posts">
          {thread.posts.map((post) => (
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
