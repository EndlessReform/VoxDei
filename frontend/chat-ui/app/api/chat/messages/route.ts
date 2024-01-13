import { sendChatRequest, common_body } from "../route";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const { chat_id, new_message } = await req.json();
  revalidateTag(chat_id);

  const res = await sendChatRequest(
    { ...common_body, parent: undefined, chat_id, new_message },
    "POST",
    `/chats/${chat_id}/messages`
  );
  if (res.status >= 400) {
    console.log(await res.json()); // Log the reason for debugging purposes
    return new Response("Internal Server Error", { status: 500 });
  } else {
    return res;
  }
}
