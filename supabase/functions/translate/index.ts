// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenAI } from "npm:openai@4.8.0";
import { z } from "npm:zod@3.22.4";
import { getCorsHeaders } from "../utils/handleCors.ts";

// Define supported languages
const SupportedLanguage = z.enum(['french', 'spanish', 'arabic', 'hindi']);
type SupportedLanguage = z.infer<typeof SupportedLanguage>;

// Define the request schema
const TranslationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  lang: SupportedLanguage
});

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const body = await req.json();
    const result = TranslationRequestSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.error.errors
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { prompt, lang } = result.data;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Translate any given text into ${lang}`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return new Response(
      JSON.stringify({
        text: response.choices[0].message.content
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Connection': 'keep-alive'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
