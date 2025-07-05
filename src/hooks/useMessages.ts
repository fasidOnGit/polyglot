import { useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import type { Message } from "@/lib/supabase/types"
import { translateFn, type SupportedLanguage } from "@/lib/supabase/functions"

export function useMessages(threadId: string | undefined) {
  const queryClient = useQueryClient()

  // Fetch messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      if (!threadId) return []
      
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })

      return (data || []) as Message[]
    },
    enabled: !!threadId
  })

  // Subscribe to new messages
  useEffect(() => {
    if (!threadId) return

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData<Message[]>(["messages", threadId], (old = []) => {
              const newMessage = payload.new as Message
              // Only add the message if it's not already in the list
              return old.some(m => m.id === newMessage.id) 
                ? old 
                : [...old, newMessage]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [threadId, queryClient])

  // Mutation for sending messages with optimistic updates
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ content, lang }: { content: string; lang: SupportedLanguage }) => {
      if (!threadId) throw new Error("No thread ID")
      return translateFn({ prompt: content, lang, thread_id: threadId })
    },
    // Optimistically add the message
    onMutate: async ({ content }) => {
      if (!threadId) return

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["messages", threadId] })

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(["messages", threadId])

      // Optimistically update to the new value
      const optimisticMessage: Partial<Message> = {
        content,
        role: "user",
        thread_id: threadId,
        created_at: new Date().toISOString()
      }

      queryClient.setQueryData<Message[]>(["messages", threadId], old => [
        ...(old || []),
        optimisticMessage as Message
      ])

      // Return a context object with the snapshotted value
      return { previousMessages }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newMessage, context) => {
      if (threadId && context?.previousMessages) {
        queryClient.setQueryData(["messages", threadId], context.previousMessages)
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      if (threadId) {
        queryClient.invalidateQueries({ queryKey: ["messages", threadId] })
      }
    }
  })

  return {
    messages,
    sendMessage,
    isPending
  }
} 