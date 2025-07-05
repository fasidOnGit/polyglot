import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import type { Thread } from "@/lib/supabase/types"

export function useThread() {
  const queryClient = useQueryClient()

  const { data: thread, isLoading: isLoadingThread } = useQuery<Thread | null>({
    queryKey: ["thread"],
    queryFn: async () => {
      const user = await supabase.auth.getUser()

      // First try to get an existing thread
      const { data: existingThread } = await supabase
        .from("threads")
        .select("*")
        .limit(1)
        .single()

      if (existingThread) {
        return existingThread as Thread
      }

      // If no thread exists, create a new one
      const { data: newThread } = await supabase
        .from("threads")
        .insert({
            user_id: user.data.user?.id || ""
        })
        .select()
        .single()

      return newThread as Thread
    }
  })

  const { mutate: createThread } = useMutation<Thread>({
    mutationFn: async () => {
      const user = await supabase.auth.getUser()

      const { data } = await supabase
        .from("threads")
        .insert({
            user_id: user.data.user?.id || ""
        })
        .select()
        .single()

      if (!data) {
        throw new Error("Failed to create thread")
      }

      return data as Thread
    },
    onSuccess: (newThread) => {
      queryClient.setQueryData(["thread"], newThread)
    }
  })

  return {
    thread,
    isLoadingThread,
    createThread
  }
} 