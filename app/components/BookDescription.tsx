import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface BookDescriptionProps {
  description: string;
  className?: string;
}

export default function BookDescription({ description, className = "" }: BookDescriptionProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {description}
      </ReactMarkdown>
    </div>
  );
} 