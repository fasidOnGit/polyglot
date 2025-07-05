export function getCorsHeaders(origin: string | null) {
    const allowedOrigins = [
      "http://localhost:5173",
    ];
    const headers: Record<string, string> = {
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
    if (origin && allowedOrigins.includes(origin)) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
    return headers;
  }
  