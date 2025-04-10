
import React from "react";
import { type PostData } from "./Thread";

interface PostProps {
  post: PostData;
  threadId: string;
  onReply: () => void;
}

const Post: React.FC<PostProps> = ({ post, threadId, onReply }) => {
  // Format content to detect greentext and reply references
  const formatContent = (content: string) => {
    // Split content by new lines
    return content.split('\n').map((line, i) => {
      // Handle greentext (lines starting with >)
      if (line.startsWith('>')) {
        return <blockquote key={i}>{line}</blockquote>;
      }
      
      // Process reply references (>>12345678)
      let parts = [];
      let lastIndex = 0;
      const regex = /&gt;&gt;(\d+)/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        
        // Add the reply reference
        parts.push(
          <span key={`${i}-${match.index}`} className="reply-link">
            &gt;&gt;{match[1]}
          </span>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      return <div key={i}>{parts.length > 0 ? parts : line}</div>;
    });
  };

  return (
    <div className="post" id={`post-${post.id}`}>
      <div className="post-header">
        <span className="post-name">
          {post.name || "Anonymous"}
        </span>
        <span className="post-timestamp">{post.timestamp}</span>
        <span className="post-id">No.{post.id}</span>
        <div className="post-number ml-auto">
          <button 
            onClick={onReply}
            className="text-blue-600 hover:underline"
          >
            &gt;&gt;{post.id}
          </button>
        </div>
      </div>
      <div className="post-content">
        {formatContent(post.content)}
      </div>
      <div className="post-actions">
        <button className="text-muted-foreground hover:text-foreground">▲</button>
        <button className="text-muted-foreground hover:text-foreground">▼</button>
      </div>
    </div>
  );
};

export default Post;
