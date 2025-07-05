import { useEffect, useRef } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useThread } from "@/hooks/useThread"
import { useMessages } from "@/hooks/useMessages"
import type { Message } from "@/lib/supabase/types"

export function ChatContainer() {
  const { thread, isLoadingThread } = useThread()
  const { messages, sendMessage, isPending } = useMessages(thread?.id)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSendMessage(content: string) {
    if (!thread?.id) return

    sendMessage(
      { content, lang: "french" }, // You might want to make this configurable
      {
        onError: (error) => {
          console.error("Translation failed:", error)
          // The mutation will automatically roll back the optimistic update
        }
      }
    )
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border-[4px] border-[#252F42]">
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport ref={scrollRef} className="h-full w-full p-4">
          <div className="flex flex-col gap-6">
            {(messages || []).map((message: Message) => (
              <ChatMessage
                key={message.id || `temp-${message.content}`}
                content={message.content}
                role={message.role}
                timestamp={new Date(message.created_at)}
              />
            ))}
            {isPending && <LoadingIndicator />}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
      <div className="p-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoadingThread || isPending}
        />
      </div>
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="flex gap-2 items-center text-gray-500">
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]" />
      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0.4s]" />
    </div>
  )
}