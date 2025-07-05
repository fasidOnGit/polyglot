import { useMutation } from '@tanstack/react-query'
import { translateFn, type TranslationRequest } from '../lib/supabase/functions'

export function useTranslation() {
  return useMutation<
    { prompt: string; lang: string },
    Error,
    TranslationRequest
  >({
    mutationFn: translateFn,
  })
} 