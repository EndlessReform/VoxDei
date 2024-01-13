"use client";

import { ChatLaunch, Hourglass, Renew } from "@carbon/icons-react";
import { useRef, useState, Suspense } from "react";
import { ChatConvoLink } from "./ChatConvoLink";
import Link from "next/link";
import useSWR from "swr";
import { DrillDown } from "@carbon/icons-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PAGE_SIZE = 20;

function ChatConvoPage({ index }: { index: number }) {
  const { data } = useSWR(
    `/api/chat/titles?page_size=${PAGE_SIZE}&page=${index}`,
    fetcher
  );
  return (
    <>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((chat, k) => (
          <ChatConvoLink
            convoID={chat.conversation_id}
            key={k}
            title={chat.title}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </>
  );
}

const EmptyState = () => {
  return (
    <p className="my-auto text-xl leading-none">
      <Hourglass size={20} className="mb-2 text-gray-400" />
      No history. <br />
      Get chatting!
    </p>
  );
};

const LoadingState = () => (
  <p className="my-auto text-xl leading-none">
    <Renew size={20} className="mb-2 text-gray-400 animate-spin-slow" />
    Loading chats...
  </p>
);

export const ChatConvoSelect = () => {
  const [page, setPage] = useState(0);

  const pages = [];
  for (let i = 0; i <= page; i++) {
    pages.push(<ChatConvoPage index={i + 1} key={i} />);
  }

  return (
    <div className="flex flex-col h-full">
      <Link
        href="/"
        className="flex items-center w-full px-3 py-2 border rounded-lg hover:bg-gray-100 sticky left-0 top-0"
      >
        New chat <ChatLaunch className="ml-auto text-gray-500" />
      </Link>
      <div className="flex flex-col flex-grow overflow-y-scroll">
        <Suspense fallback={<LoadingState />}>
          <div className="mt-4">{pages}</div>
          <button
            onClick={() => setPage(page + 1)}
            className="flex items-center px-3 py-2 mt-2 rounded-lg text-left text-gray-500 hover:text-gray-800"
          >
            <DrillDown className="inline-block w-4 h-4 mr-1 " />
            Show more
          </button>
        </Suspense>
      </div>
      <div className="flex-shrink">
        <p className="font-medium font-expanded">
          Vox Dei <span className="font-normal text-gray-500">β0.3</span>
        </p>
      </div>
    </div>
  );
};
