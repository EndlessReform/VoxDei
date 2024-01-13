import { Copy, Redo } from "@carbon/icons-react";

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
}

interface IMessageProps {
  role: string;
  content: string;
  isLoading?: boolean;
  /** Regenerate the message */
  regen?: () => void;
}

export const Message = ({ role, content, isLoading, regen }: IMessageProps) => {
  return (
    <div className="pb-6 font-sans leading-5">
      <p className="text-gray-400 capitalize">{role}</p>
      <p className="whitespace-pre-line">{content}</p>
      {role !== "user" && !isLoading && (
        <div className="flex items-center mt-1 text-gray-400">
          <button
            className="block text-xs font-semibold uppercase rounded-lg hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => copyToClipboard(content)}
            aria-label="Copy to clipboard"
          >
            <Copy className="inline-block mr-2" />
          </button>
          {regen && (
            <button
              className="block text-xs font-semibold uppercase rounded-lg hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => regen()}
              aria-label="Copy to clipboard"
            >
              <Redo className="inline-block mr-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
