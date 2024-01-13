export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const page_size = searchParams.get("page_size") || "10";

  const data = await fetch(
    `${process.env.CHAT_HISTORY_SERVICE_URL}/chats/titles?page=${page}&page_size=${page_size}`
  );

  return new Response(await data.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
