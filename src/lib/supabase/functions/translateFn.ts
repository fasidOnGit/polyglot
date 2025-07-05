import { z } from 'zod'
import { supabase } from '../client'

// Define supported languages
export const SupportedLanguage = z.enum(['french', 'spanish', 'arabic', 'hindi'])
export type SupportedLanguage = z.infer<typeof SupportedLanguage>

// Define request schema
export const TranslationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  lang: SupportedLanguage
})

export type TranslationRequest = z.infer<typeof TranslationRequestSchema>

interface TranslateResponse {
  text: string
}

export async function translateFn({ prompt, lang }: TranslationRequest): Promise<TranslateResponse> {
  // Validate the request
  TranslationRequestSchema.parse({ prompt, lang })

  const { data, error } = await supabase.functions.invoke('translate', {
    body: {
      prompt,
      lang,
    },
  })

  if (error) {
    throw new Error(`Translation failed: ${error.message}`)
  }

  return {
    text: data.text,
  }
} 