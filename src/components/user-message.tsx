import type { Message } from "@ai-sdk/react";
import { UserIcon } from "lucide-react";

import Avatar from "./avatar";
import Markdown from "./markdown";

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-row-reverse gap-6">
      <Avatar fallbackIcon={<UserIcon />} />
      <div className="grid flex-1 justify-end gap-4">
        <div className="prose-base pt-1.5">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
