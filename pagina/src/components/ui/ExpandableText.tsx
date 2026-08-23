import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
  showMoreText?: string;
  showLessText?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLength = 280,
  className = "text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium text-justify [text-justify:inter-word] [text-align-last:left]",
  buttonClassName,
  showMoreText = "ver más",
  showLessText = "ver menos",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <p className={className}>{text}</p>;
  }

  let truncatedText = "";
  if (!isExpanded) {
    const rawLines = text.split(/\r?\n/);
    if (rawLines.length > 1) {
      let accumulated = "";
      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        if (accumulated.length + line.length > maxLength && i > 0) {
          break;
        }
        accumulated += (i > 0 ? "\n" : "") + line;
      }
      truncatedText = accumulated.trimEnd();
      if (!truncatedText || truncatedText.length < 60) {
        truncatedText = text.slice(0, maxLength).trimEnd();
      }
    } else {
      const periodIdx = text.indexOf('. ', maxLength - 40);
      if (periodIdx !== -1 && periodIdx < maxLength + 40) {
        truncatedText = text.slice(0, periodIdx + 1).trimEnd();
      } else {
        truncatedText = text.slice(0, maxLength).trimEnd();
      }
    }
  }

  const defaultBtnClass = cn(
    "text-primary font-bold hover:underline cursor-pointer focus:outline-none transition-colors inline ml-1.5",
    buttonClassName
  );

  return (
    <div className="space-y-1.5">
      <p className={className}>
        {isExpanded ? text : truncatedText}
        {!isExpanded && (
          <>
            <span className="text-slate-500 font-medium">... </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className={defaultBtnClass}
            >
              {showMoreText}
            </button>
          </>
        )}
      </p>
      {isExpanded && (
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="text-slate-400 font-semibold text-xs hover:underline hover:text-slate-600 cursor-pointer focus:outline-none transition-colors inline-block mt-1"
          >
            {showLessText}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableText;
