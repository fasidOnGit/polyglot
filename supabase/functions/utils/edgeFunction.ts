import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from "npm:zod@3.22.4";
import { getCorsHeaders } from "./handleCors.ts";

export const baseRequestSchema = {
  prompt: z.string().min(1, "Prompt cannot be empty"),
  thread_id: z.string().uuid("Invalid thread ID")
};

export interface EdgeFunctionContext {
  supabase: ReturnType<typeof createClient>;
  corsHeaders: Record<string, string>;
}

export async function handleEdgeFunction<T extends z.ZodType>(
  req: Request,
  schema: T,
  handler: (context: EdgeFunctionContext, data: z.infer<T>) => Promise<Response>
): Promise<Response> {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') ?? ''
          }
        }
      }
    );

    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.error.errors
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return await handler({ supabase, corsHeaders }, result.data);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function saveMessages(
  context: EdgeFunctionContext,
  { prompt, thread_id, response }: {
    prompt: string;
    thread_id: string;
    response: string;
  }
): Promise<Response | null> {
  const { error } = await context.supabase.from('messages').insert([
    {
      content: prompt,
      thread_id,
      role: "user"
    },
    {
      content: response,
      thread_id,
      role: "assistant"
    }
  ]);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...context.corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  return null;
} 