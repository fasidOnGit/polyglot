import { z } from "zod";
import { supabase } from "../client"

// Define supported languages
const SupportedLanguage = z.enum(['french', 'spanish', 'arabic', 'hindi']);
export type SupportedLanguage = z.infer<typeof SupportedLanguage>;

// Define the request schema
export const TranslationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  lang: SupportedLanguage,
  thread_id: z.string().uuid("Invalid thread ID")
});

export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;

export interface TranslationResponse {
  text: string
}

export async function translateFn(params: TranslationRequest): Promise<TranslationResponse> {
  const { data, error } = await supabase.functions.invoke<TranslationResponse>("translate", {
    body: params
  })

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("No response data received")
  }

  return data
} 