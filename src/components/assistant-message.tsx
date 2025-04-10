import type { Message } from "@ai-sdk/react";
import type { Annotations } from "siteassist-core";
import { BotIcon, Loader2Icon } from "lucide-react";
import { useMemo } from "react";

import Avatar from "./avatar";
import Markdown from "./markdown";

export interface AssistantMessageProps {
  message: Message;
  isCurrentlyStreaming?: boolean;
}

export default function AssistantMessage({
  message,
  isCurrentlyStreaming,
}: AssistantMessageProps) {
  const status = useMemo(() => {
    const statuses =
      (message.annotations as Annotations | null | undefined)?.filter(
        (item) => item.type === "status"
      ) ?? [];
    if (!statuses.length) {
      return null;
    }
    return statuses[statuses.length - 1];
  }, [message.annotations]);

  const sources = useMemo(
    () =>
      (message.annotations as Annotations | null | undefined)?.find(
        (item) => item.type === "sources"
      )?.sources ?? [],
    [message.annotations]
  );

  return (
    <div className="flex flex-row gap-6">
      <Avatar fallbackIcon={<BotIcon />} />
      <div className="grid flex-1 gap-4">
        {isCurrentlyStreaming && !message.content.trim() ? (
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2Icon className="size-5 animate-spin" />
            {status ? <p>{status?.message}</p> : null}
          </div>
        ) : (
          <div className="prose-base max-w-full overflow-hidden pt-1.5">
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {isCurrentlyStreaming ? null : (
          <>
            {sources.length > 0 ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => {
                    if (source.type === "link") {
                      return (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-background hover:bg-secondary text-muted-foreground hover:text-foreground max-w-[320px] rounded-full border px-2 py-0.5 text-sm hover:underline"
                        >
                          <span className="truncate">
                            {source.title ??
                              source.url.replace(/https?:\/\//, "")}
                          </span>
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
