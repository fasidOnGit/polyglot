import { useMutation } from '@tanstack/react-query'
import { translateFn, type TranslationRequest } from '../lib/supabase/functions'

interface TranslationResponse {
  text: string
}

export function useTranslation() {
  return useMutation<
    TranslationResponse,
    Error,
    TranslationRequest
  >({
    mutationFn: async (params) => {
      const result = await translateFn(params)
      return result
    }
  })
} 