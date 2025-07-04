import { useMutation } from '@tanstack/react-query'
import { translateFn, type TranslationRequest } from '../lib/supabase/functions'

export function useTranslation() {
  return useMutation<
    { translatedText: string; detectedSourceLang?: string },
    Error,
    TranslationRequest
  >({
    mutationFn: translateFn,
  })
} 