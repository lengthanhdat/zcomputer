"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleDescription({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Also re-check when window is resized or images load
    const checkHeight = () => {
      if (contentRef.current) {
        if (contentRef.current.scrollHeight > 500) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };
    
    checkHeight();
    
    window.addEventListener("resize", checkHeight);
    
    // Check again after a small delay to account for image rendering
    const timer = setTimeout(checkHeight, 1000);
    
    return () => {
      window.removeEventListener("resize", checkHeight);
      clearTimeout(timer);
    };
  }, [content]);

  if (!content) {
    return <p className="text-gray-500 italic">Đang cập nhật thông tin sản phẩm...</p>;
  }

  const hasHtml = content.includes('<p>') || content.includes('<h2>') || content.includes('<h3>') || content.includes('<br>') || content.includes('<img');
  
  return (
    <div>
      <div className="relative">
        <div 
          ref={contentRef}
          className={`prose prose-lg max-w-none text-gray-800 leading-relaxed text-justify prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:brightness-110 prose-img:rounded-xl prose-img:shadow-md [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto ql-snow overflow-hidden transition-all duration-500 ${!isExpanded && showButton ? 'max-h-[500px]' : ''}`}
        >
          {hasHtml ? (
            <div className="ql-editor p-0 min-w-full" dangerouslySetInnerHTML={{ __html: content.replace(/&nbsp;/g, ' ') }} />
          ) : (
            <div className="ql-editor p-0">
              {content.replace(/&nbsp;/g, ' ').split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>
        
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>
      
      {showButton && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp size={18} /></>
            ) : (
              <>Xem thêm nội dung <ChevronDown size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
