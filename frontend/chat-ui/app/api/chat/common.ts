export const MODEL = "pplx-7b-chat";

export const common_body = {
  model_slug: MODEL,
  platform: "vox_dei",
};

export async function sendChatRequest(
  body: Record<string, any>,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  /// Defaults to the env var, but can be overridden
  base_url: string = process.env.CHAT_HISTORY_SERVICE_URL || ""
) {
  const res = await fetch(base_url + path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: method != "GET" ? "no-store" : undefined,
  });

  if (res.status >= 400) {
    console.log(await res.json()); // Log the reason for debugging purposes
    return new Response("Internal Server Error", { status: 500 });
  }

  return res;
}
