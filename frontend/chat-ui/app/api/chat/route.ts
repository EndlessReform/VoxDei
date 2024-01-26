// ./app/api/chat/route.ts
import { revalidateTag } from "next/cache";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { common_body, sendChatRequest, MODEL } from "./common";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  /* TODO: Parameterize the engine */
  // Extract the `prompt` from the body of the request
  const { messages, convo_id, is_new } = await req.json();

  //console.log(messages);

  if (is_new) {
    const newConvoBody = {
      ...common_body,
      conversation_id: convo_id,
      messages,
      title:
        messages.length >= 2
          ? `${messages[1].content.substring(0, 32)}...`
          : "",
    };
    await sendChatRequest(newConvoBody, "POST", "/chats");
    // Clear cache
    revalidateTag("convo_ids");
    revalidateTag(convo_id);
  } else {
    if (messages.length < 2) {
      return new Response("Error: Adding new message to blank existing convo", {
        status: 400,
      });
    }
    const updateConvoBody = {
      ...common_body,
      parent_id: messages[messages.length - 2].id,
      new_message: messages[messages.length - 1],
    };
    await sendChatRequest(
      updateConvoBody,
      "POST",
      `/chats/${convo_id}/messages`
    );
  }

  revalidateTag(convo_id);
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: messages,
    max_tokens: 1024,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
