import { Avatar } from "@radix-ui/react-avatar"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user"
  
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? "bg-gray-200" : "bg-emerald-100"
      }`}>
        {isUser ? (
          <span className="text-sm font-medium">U</span>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Robot face */}
            <div className="text-emerald-600 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="12" r="1" fill="currentColor" />
                <circle cx="15" cy="12" r="1" fill="currentColor" />
                <path d="M8 16s1.5 1 4 1 4-1 4-1" />
                <path d="M7 8h10" />
              </svg>
            </div>
          </div>
        )}
      </Avatar>
      
      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div 
          className={`rounded-lg px-4 py-2 ${
            isUser 
              ? "bg-blue-500 text-white" 
              : "bg-emerald-50 text-gray-900 border border-emerald-200"
          }`}
        >
          {content}
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          })}
        </span>
      </div>
    </div>
  )
} 