// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenAI } from "npm:openai@4.8.0";
import { z } from "npm:zod@3.22.4";
import { handleEdgeFunction, baseRequestSchema, saveMessages } from "../utils/edgeFunction.ts";

// Define supported languages
const SupportedLanguage = z.enum([
  'french',
  'spanish',
  'arabic',
  'hindi'
]);

// Define the request schema
const TranslationRequestSchema = z.object({
  ...baseRequestSchema,
  lang: SupportedLanguage,
});

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

Deno.serve((req) => handleEdgeFunction(req, TranslationRequestSchema, async (context, data) => {
  const { prompt, lang, thread_id } = data;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 1.5,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: `You are a translator. You are given a text and you need to translate it into ${lang}.`
      },
      {
        role: "user",
        content: `Translate the following text into ${lang}: ${prompt}`
      }
    ]
  });

  const translatedText = response.choices[0].message.content;
  const saveError = await saveMessages(context, {
    prompt,
    thread_id,
    response: translatedText
  });

  if (saveError) return saveError;

  return new Response(
    JSON.stringify({ text: translatedText }),
    {
      headers: {
        ...context.corsHeaders,
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    }
  );
}));

