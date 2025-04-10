
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ReplyFormProps {
  threadId: string;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ threadId, onCancel }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reply submitted:", { threadId, name, content });
    
    // In a real app, this would send data to the server
    // and update the state with the new post
    
    // Reset form and close
    setName("");
    setContent("");
    onCancel();
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
        >
          Cancel
        </Button>
        <Button type="submit" size="sm">Post Reply</Button>
      </div>
    </form>
  );
};

export default ReplyForm;
