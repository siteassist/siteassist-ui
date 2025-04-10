import type {UseChatOptions} from '@ai-sdk/react';
import {useChat} from '@ai-sdk/react';

import {useSiteAssist} from './providers/siteassist-provider';

export type UseSiteAssistChatOptions = Omit<
  UseChatOptions,
  | 'api'
  | 'headers'
  | 'body'
  | 'id'
  | 'credentials'
  | 'fetch'
  | 'generateId'
  | 'sendExtraMessageFields'
  | 'streamProtocol'
> & {
  threadId: string;
  assistantId?: string;
};

export const useSiteAssistChat = ({
  threadId,
  assistantId,
  ...rest
}: UseSiteAssistChatOptions) => {
  const {client} = useSiteAssist();
  return useChat({
    api: `${client.apiUri}/v1/threads/${threadId}/chat`,
    body: {
      assistantId: assistantId ?? client.assistantId,
    },
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${client.apiKey}`,
    },
    id: threadId,
    ...rest,
  });
};
