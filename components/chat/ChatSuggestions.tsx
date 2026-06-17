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
    <div className="mb-2 space-y-3 px-5">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
        Common questions
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="flex max-w-full items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-left text-xs font-medium leading-5 text-stone-700 shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
            <span className="truncate">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
