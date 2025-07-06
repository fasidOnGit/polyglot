import { z } from "zod";
import { supabase } from "../client";

// Define supported image sizes
const ImageSize = z.enum(['1024x1024', '1024x1792', '1792x1024']);
export type ImageSize = z.infer<typeof ImageSize>;

// Define the request schema
export const ImageGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  size: ImageSize.default('1024x1024'),
  thread_id: z.string().uuid("Invalid thread ID")
});

export type ImageGenerationRequest = z.infer<typeof ImageGenerationRequestSchema>;

export interface ImageGenerationResponse {
  image_url: string;
}

export async function generateImageFn(params: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const { data, error } = await supabase.functions.invoke<ImageGenerationResponse>("generate-image", {
    body: params
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No response data received");
  }

  return data;
} 