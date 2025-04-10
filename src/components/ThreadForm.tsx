
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useDb } from "@/lib/DbContext";
import { useToast } from "@/components/ui/use-toast";
import { PostData } from "./Thread";

interface ThreadFormProps {
  onCancel: () => void;
  boardType?: "random" | "technology" | "anime";
  onThreadCreated?: (thread: { id: string, title: string, posts: PostData[] }) => void;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ onCancel, boardType = "random", onThreadCreated }) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { createThread, getThreadWithPosts } = useDb();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const threadId = await createThread(
        title.trim() || "Anonymous Thread",
        name.trim() || "Anonymous",
        content
      );
      
      if (threadId) {
        toast({
          title: "Success",
          description: "Thread created successfully",
        });
        
        // Get the created thread with posts
        if (onThreadCreated) {
          const threadData = await getThreadWithPosts(threadId);
          if (threadData) {
            onThreadCreated({
              id: threadData.thread.id,
              title: threadData.thread.title,
              posts: threadData.posts.map(post => ({
                id: post.id,
                content: post.content,
                name: post.name,
                timestamp: post.timestamp,
                isOP: post.is_op
              }))
            });
          }
        }
        
        // Reset form
        setName("");
        setTitle("");
        setContent("");
      } else {
        toast({
          title: "Error",
          description: "Failed to create thread",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the thread",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      if (!onThreadCreated) {
        onCancel();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-card border border-border">
      <h3 className="mb-3 font-bold">Create New Thread</h3>
      <div className="mb-2">
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-sm h-8 mb-2"
        />
        <Input
          type="text"
          placeholder="Subject (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm h-8"
        />
      </div>
      <div className="mb-2">
        <Textarea
          placeholder="Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[150px] text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Creating..." : "Create Thread"}
        </Button>
      </div>
    </form>
  );
};

export default ThreadForm;
