import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { LanguageSelector } from "./LanguageSelector"
import { ModeSelector, type ChatMode } from "./ModeSelector"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useThread } from "@/hooks/useThread"
import { useMessages } from "@/hooks/useMessages"
import { useImageGeneration } from "@/hooks/useImageGeneration"
import { useQueryClient } from "@tanstack/react-query"
import type { Message } from "@/lib/supabase/types"
import type { SupportedLanguage } from "@/lib/supabase/functions/translateFn"

export function ChatContainer() {
  const { thread, isLoadingThread } = useThread()
  const { messages, sendMessage, isPending: isTranslationPending } = useMessages(thread?.id)
  const { mutate: generateImage, isPending: isImageGenerationPending } = useImageGeneration()
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("french")
  const [mode, setMode] = useState<ChatMode>("translate")
  const scrollRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const isPending = isTranslationPending || isImageGenerationPending

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSendMessage(content: string) {
    if (!thread?.id) return

    if (mode === "translate") {
      sendMessage(
        { content, lang: selectedLanguage },
        {
          onError: (error) => {
            console.error("Translation failed:", error)
          }
        }
      )
    } else {
      // Optimistically add the user's message
      const optimisticUserMessage: Partial<Message> = {
        content,
        role: "user",
        thread_id: thread.id,
        created_at: new Date().toISOString()
      }

      // Add loading message for assistant
      const optimisticLoadingMessage: Partial<Message> = {
        content: "Generating image...",
        role: "assistant",
        thread_id: thread.id,
        created_at: new Date().toISOString()
      }

      // Get current messages
      const previousMessages = queryClient.getQueryData<Message[]>(["messages", thread.id])

      // Update messages with optimistic data
      queryClient.setQueryData<Message[]>(["messages", thread.id], old => [
        ...(old || []),
        optimisticUserMessage as Message,
        optimisticLoadingMessage as Message
      ])

      generateImage(
        { 
          prompt: content,
          thread_id: thread.id,
          size: "1024x1024"
        },
        {
          onSuccess: (data) => {
            // Replace loading message with actual image URL
            queryClient.setQueryData<Message[]>(["messages", thread.id], old => {
              if (!old) return []
              // Remove loading message and add actual response
              const filtered = old.filter(msg => msg.content !== "Generating image...")
              return [
                ...filtered,
                {
                  content: data.image_url,
                  role: "assistant",
                  thread_id: thread.id,
                  created_at: new Date().toISOString()
                } as Message
              ]
            })
          },
          onError: (error) => {
            console.error("Image generation failed:", error)
            // Restore previous messages on error
            if (previousMessages) {
              queryClient.setQueryData(["messages", thread.id], previousMessages)
            }
          }
        }
      )
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border-[4px] border-[#252F42]">
      <div className="p-4 border-b border-gray-200">
        <ModeSelector
          value={mode}
          onChange={setMode}
          disabled={isPending}
        />
      </div>
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport ref={scrollRef} className="h-full w-full p-4">
          <div className="flex flex-col gap-6">
            {(messages || []).map((message: Message) => (
              <ChatMessage
                key={message.id || `temp-${message.content}-${message.created_at}`}
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
      
      <div className="p-4 space-y-4">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoadingThread || isPending}
        />
        {mode === "translate" && (
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            disabled={isPending}
          />
        )}
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