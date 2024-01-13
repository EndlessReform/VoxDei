import { Message } from "ai";

export const persist_message = (m: Message, convo_id: string) => {
  (async () => {
    try {
      console.log("Sending message");
      await fetch(`/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: convo_id,
          new_message: m,
        }),
        cache: "no-store",
      });
    } catch (e) {
      console.log(e);
    }
  })();
};
