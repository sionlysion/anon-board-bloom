
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ThreadFormProps {
  onCancel: () => void;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Thread submitted:", { name, title, content });
    
    // In a real app, this would send data to the server
    // and update the state with the new thread
    
    // Reset form and close
    setName("");
    setTitle("");
    setContent("");
    onCancel();
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
        >
          Cancel
        </Button>
        <Button type="submit" size="sm">Create Thread</Button>
      </div>
    </form>
  );
};

export default ThreadForm;
