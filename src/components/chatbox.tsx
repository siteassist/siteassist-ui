import {ArrowDownIcon, BotIcon, Loader2Icon, SendIcon} from 'lucide-react';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';

import {useChatBox} from '@/providers/chatbox-provider';
import {useSiteAssist} from '@/providers/siteassist-provider';
import {cn} from '@/utils';

import AssistantMessage from './assistant-message';
import Avatar from './avatar';
import MessageInput from './message-input';
import UserMessage from './user-message';

export default function ChatBox() {
  return (
    <div className="bg-background text-foreground relative flex h-full w-full flex-1 flex-col overflow-hidden font-sans antialiased">
      <MessagesList />
      <MessageInputBox />
    </div>
  );
}

function MessagesList() {
  const {assistant} = useSiteAssist();
  const {messages, tempMessage, status} = useChatBox();
  const [showScrollDownButtom, setShowScrollDownButtom] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      top:
        scrollViewRef.current.scrollHeight - scrollViewRef.current.clientHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      top:
        scrollViewRef.current.scrollHeight - scrollViewRef.current.clientHeight,
    });
  }, [messages, tempMessage, status]);

  useEffect(() => {
    const sv = scrollViewRef.current;
    if (!sv) {
      return;
    }

    const onScroll = () => {
      const scrollDistanceFromBottom =
        sv.scrollHeight - sv.clientHeight - sv.scrollTop;
      if (scrollDistanceFromBottom > 40) {
        setShowScrollDownButtom(true);
      } else {
        setShowScrollDownButtom(false);
      }
    };

    sv.addEventListener('scroll', onScroll);
    return () => {
      sv.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto" ref={scrollViewRef}>
        <div className="mx-auto grid max-w-screen-lg gap-6 p-6">
          {assistant?.welcomeMessages?.map((message, i) => (
            <AssistantMessage
              key={`message-${i}`}
              message={{
                id: `message-${i}`,
                content: message,
                role: 'assistant',
              }}
            />
          ))}
          {messages.map((message, i) => {
            const isCurrentlyStreaming =
              status === 'streaming' && i == messages.length - 1;
            return (
              <Fragment key={message.id}>
                <>
                  {message.role === 'user' ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage
                      message={message}
                      key={message.id}
                      isCurrentlyStreaming={isCurrentlyStreaming}
                    />
                  )}
                </>
                {i < messages.length - 1 ? (
                  <div className="bg-border h-px"></div>
                ) : null}
              </Fragment>
            );
          })}
          {tempMessage ? (
            <UserMessage
              message={{
                id: 'temp',
                content: tempMessage.content,
                role: 'user',
              }}
            />
          ) : null}
          {status === 'submitted' || tempMessage ? (
            <>
              <div className="bg-border h-px"></div>
              <div className="flex flex-row gap-6">
                <Avatar fallbackIcon={<BotIcon />} />
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2Icon className="size-5 animate-spin" />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <button
        onClick={scrollToBottom}
        className={cn(
          'bg-background text-muted-foreground hover:text-foreground absolute bottom-4 left-1/2 z-50 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border transition-[bottom,color,opacity] duration-200 [&_svg]:size-5',
          {
            'pointer-events-none -bottom-10 opacity-0': !showScrollDownButtom,
          },
        )}
      >
        <ArrowDownIcon />
      </button>
    </div>
  );
}

function MessageInputBox() {
  const {isProjectLoaded} = useSiteAssist();
  const {
    handleSubmit,
    status,
    isSendingMessage,
    isMessagesLoading,
    input,
    setInput,
  } = useChatBox();
  const textreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      textreaRef.current?.focus();
    });
  }, []);

  return (
    <div className="mx-auto grid w-full max-w-screen-lg gap-4 p-6 pt-4">
      <form
        onSubmit={handleSubmit}
        className="bg-muted ring-offset-background ring-ring flex items-end overflow-hidden rounded-lg border p-1 ring-offset-1 focus-within:ring-2"
      >
        <MessageInput
          ref={textreaRef}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          className="flex-1 resize-none bg-transparent px-2 py-2 leading-6 outline-none"
          rows={1}
          autoFocus
        />

        <button
          className="text-muted-foreground hover:text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5"
          type="submit"
          disabled={
            !input.trim() ||
            !isProjectLoaded ||
            isSendingMessage ||
            isMessagesLoading ||
            status === 'submitted' ||
            status === 'streaming'
          }
        >
          {isSendingMessage ||
          status === 'streaming' ||
          status === 'submitted' ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
        </button>
      </form>
      <div>
        <p className="text-muted-foreground text-sm leading-none">
          Powered By{' '}
          <a
            href="https://siteassist.io"
            className="text-foreground font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            SiteAssist.io
          </a>
        </p>
      </div>
    </div>
  );
}
