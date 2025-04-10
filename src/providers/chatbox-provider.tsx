import type {
  CreateMessage,
  Message as ChatMessage,
  UseChatHelpers,
} from '@ai-sdk/react';
import type {Dispatch, FormEvent, ReactNode, SetStateAction} from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {useSiteAssistChat} from '@/hooks';

import {useSiteAssist} from './siteassist-provider';

export interface ChatBoxContextValue
  extends Omit<UseChatHelpers, 'handleSubmit'> {
  threadId: string | null;
  setThreadId: Dispatch<SetStateAction<string | null>>;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  tempMessage: CreateMessage | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ChatBoxContext = createContext<ChatBoxContextValue | null>(null);

export default function ChatBoxProvider({children}: {children: ReactNode}) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loadThreadCalled, setLoadThreadCalled] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [tempMessage, setTempMessage] = useState<CreateMessage | null>(null);
  const {client, isProjectLoaded} = useSiteAssist();

  const {
    messages,
    append,
    status,
    setMessages,
    input,
    setInput,
    ...restChatResult
  } = useSiteAssistChat({
    threadId: threadId ?? '',
  });

  const submitionDissabled = useMemo(
    () =>
      !isProjectLoaded ||
      isSendingMessage ||
      isMessagesLoading ||
      status === 'streaming' ||
      status === 'submitted',
    [isProjectLoaded, isSendingMessage, isMessagesLoading, status],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (submitionDissabled) {
        return;
      }

      if (!input.trim()) {
        return;
      }

      const message: CreateMessage = {
        role: 'user',
        content: input,
      };
      setInput('');

      if (!threadId) {
        setIsSendingMessage(true);
        setTempMessage(message);
        try {
          const thread = await client.createThread();
          setThreadId(thread.id);
        } catch (error) {
          console.error(error);
          setTempMessage(null);
        } finally {
          setIsSendingMessage(false);
        }
      } else {
        append(message);
      }
    },
    [
      append,
      client,
      input,
      setInput,
      setThreadId,
      submitionDissabled,
      threadId,
    ],
  );

  const loadThread = useCallback(
    async (threadId: string) => {
      setIsMessagesLoading(true);
      try {
        const messages = await client.getMessages(threadId);
        setMessages(
          messages.map((message) => {
            return {
              id: message.id,
              content: message.content,
              role: message.role,
              createdAt: message.createdAt,
              annotations: (message.annotations ??
                []) as ChatMessage['annotations'],
            };
          }),
        );
      } catch (error) {
        console.error(error);
        // toast.error("Failed to load messages!", {
        //   description: error instanceof Error ? error.message : String(error),
        // });
      } finally {
        setIsMessagesLoading(false);
      }
    },
    [client, setMessages],
  );

  useEffect(() => {
    if (threadId && tempMessage) {
      append(tempMessage);
      setTempMessage(null);
    }
  }, [append, tempMessage, threadId]);

  useEffect(() => {
    if (loadThreadCalled) {
      return;
    }
    setLoadThreadCalled(true);

    if (threadId) {
      loadThread(threadId);
    }
  }, [loadThread, threadId, loadThreadCalled]);

  return (
    <ChatBoxContext.Provider
      value={{
        messages,
        append,
        status,
        setMessages,
        input,
        setInput,
        ...restChatResult,
        handleSubmit,
        threadId,
        setThreadId,
        isMessagesLoading,
        isSendingMessage,
        tempMessage,
      }}
    >
      {children}
    </ChatBoxContext.Provider>
  );
}

export const useChatBox = () => {
  const context = useContext(ChatBoxContext);
  if (!context) {
    throw new Error('useChatBox must use inside a ChatBoxProvider');
  }
  return context;
};
