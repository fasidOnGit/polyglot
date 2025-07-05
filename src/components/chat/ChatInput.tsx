import { useState, KeyboardEvent } from "react"
import { Button } from "../ui/button"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")

  function handleSend() {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 items-end border-t pt-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 min-h-[80px] max-h-[200px] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      <Button 
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        Send
      </Button>
    </div>
  )
} 