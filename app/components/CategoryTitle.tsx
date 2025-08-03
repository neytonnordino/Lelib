"use client";

import { useState, useEffect } from "react";

interface CategoryTitleProps {
  categoryName: string;
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ categoryName }) => {
  const [text, setText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const typingSpeed = isDeleting ? 50 : 100; // Faster when deleting

  useEffect(() => {
    if (!categoryName) return; // Evita erro se categoryName for undefined

    let timeout: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting && text.length < categoryName.length) {
        setText((prev) => categoryName.substring(0, prev.length + 1));
        timeout = setTimeout(type, typingSpeed);
      } else if (isDeleting && text.length > 0) {
        setText((prev) => categoryName.substring(0, prev.length - 1));
        timeout = setTimeout(type, typingSpeed);
      } else if (!isDeleting && text.length === categoryName.length) {
        timeout = setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text.length === 0) {
        setIsDeleting(false);
        timeout = setTimeout(type, 500);
      }
    };

    timeout = setTimeout(type, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, categoryName]);

  return (
    <h4 className="text-2xl mt-6 transition">
      {text}
      <span className="animate-blink"></span>
    </h4>
  );
};

export default CategoryTitle;
