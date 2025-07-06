// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenAI } from "npm:openai@4.8.0";
import { z } from "npm:zod@3.22.4";
import { handleEdgeFunction, baseRequestSchema, saveMessages } from "../utils/edgeFunction.ts";

// Define the request schema
const ImageGenerationRequestSchema = z.object({
  ...baseRequestSchema,
  size: z.enum(['1024x1024', '1024x1792', '1792x1024']).default('1024x1024'),
});

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

Deno.serve((req) => handleEdgeFunction(req, ImageGenerationRequestSchema, async (context, data) => {
  const { prompt, size, thread_id } = data;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size,
    n: 1,
    response_format: "url",
    style: 'vivid'
  });

  const imageUrl = response.data[0].url;
  const saveError = await saveMessages(context, {
    prompt,
    thread_id,
    response: imageUrl
  });

  if (saveError) return saveError;

  return new Response(
    JSON.stringify({ image_url: imageUrl }),
    {
      headers: {
        ...context.corsHeaders,
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    }
  );
})); 