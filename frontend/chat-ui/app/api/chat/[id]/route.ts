import { Message } from "ai";

// The maintainers of Next.js can go fuck themselves.
// Will revisit this if perf becomes a problem, but for now, Leerob can eat a bag of dicks.
// https://github.com/vercel/next.js/issues/57632
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const base_url = process.env.CHAT_HISTORY_SERVICE_URL || "";
  const res = await fetch(base_url + `/chats/${params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  let current_message_id: string | null = data["last_message"];
  let messages = [];
  while (!!current_message_id) {
    const current_message = data.mapping[current_message_id];
    const new_message: Message = {
      id: current_message_id,
      role: current_message.author.role,
      content: current_message.content,
    };
    messages.push(new_message);
    current_message_id = current_message["parent"];
  }
  messages = messages.reverse();

  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
