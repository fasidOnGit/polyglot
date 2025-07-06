import { useMutation } from '@tanstack/react-query';
import { generateImageFn, type ImageGenerationRequest, type ImageGenerationResponse } from '../lib/supabase/functions/generateImageFn';

export function useImageGeneration() {
  return useMutation<
    ImageGenerationResponse,
    Error,
    ImageGenerationRequest
  >({
    mutationFn: async (params) => {
      const result = await generateImageFn(params);
      return result;
    }
  });
} 