
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useDb } from "@/lib/DbContext";
import { useToast } from "@/components/ui/use-toast";
import { PostData } from "./Thread";

interface ReplyFormProps {
  threadId: string;
  onCancel: () => void;
  onReplyCreated?: (post: PostData) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ threadId, onCancel, onReplyCreated }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { createPost } = useDb();
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
      const postId = await createPost(
        threadId,
        name.trim() || "Anonymous",
        content
      );
      
      if (postId) {
        toast({
          title: "Success",
          description: "Reply posted successfully",
        });
        
        const timestamp = new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1/$2/$3(Fri)$4:$5:$6');
        
        // Notify parent component about the new reply
        if (onReplyCreated) {
          onReplyCreated({
            id: postId,
            name: name.trim() || "Anonymous",
            content: content,
            timestamp: timestamp,
            isOP: false
          });
        }
        
        // Reset form
        setName("");
        setContent("");
        onCancel();
      } else {
        toast({
          title: "Error",
          description: "Failed to post reply",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description: "An error occurred while posting your reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 bg-secondary/50 border border-border">
      <div className="mb-2">
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-sm h-8"
        />
      </div>
      <div className="mb-2">
        <Textarea
          placeholder="Comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[100px] text-sm"
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
          {submitting ? "Posting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;
