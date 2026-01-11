import { MessageSquare } from "lucide-react";

interface ChatSuggestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export function ChatSuggestions({
  questions,
  onQuestionClick,
}: ChatSuggestionsProps) {
  return (
    <div className="space-y-2 mb-2">
      <p className="text-xs font-medium text-stone-500 px-1">Common questions:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full px-3 py-1.5 transition-colors text-stone-700 flex items-center gap-1.5"
          >
            <MessageSquare className="h-3 w-3 text-emerald-600" />
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

