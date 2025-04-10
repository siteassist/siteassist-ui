import * as DialogPrimitives from '@radix-ui/react-dialog';
import {useCallback, useEffect, useState} from 'react';
import {SiteAssistClient} from 'siteassist-core';

import ChatBox from '@/components/chatbox';
import ChatBoxProvider from '@/providers/chatbox-provider';
import {SiteAssistProvider} from '@/providers/siteassist-provider';
import TailwindCSS from '@/tailwindcss';

export interface ChatBoxWidgetProps {
  apiKey?: string;
  apiUri?: string;
  assistantId?: string;
  root: ShadowRoot;
}

export default function ChatBoxWidget({
  apiKey,
  apiUri,
  assistantId,
  root,
}: ChatBoxWidgetProps) {
  const [open, setOpen] = useState(false);
  if (!apiKey) {
    throw new Error('api-key is required');
  }

  const [client] = useState(
    () => new SiteAssistClient({apiKey, apiUri, assistantId}),
  );

  const handleOpenChatbox = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    document.addEventListener('open-sa-chatbox', handleOpenChatbox);
    return () => {
      document.removeEventListener('open-sa-chatbox', handleOpenChatbox);
    };
  }, [handleOpenChatbox]);

  return (
    <TailwindCSS>
      <SiteAssistProvider client={client}>
        <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitives.Portal container={root}>
            <DialogPrimitives.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-modal-overlay fixed inset-0 z-50 backdrop-blur-sm" />
            <DialogPrimitives.Content
              onWheel={(e) => {
                e.stopPropagation();
              }}
              className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2 bg-background text-foreground fixed left-1/2 top-10 z-50 flex max-h-[calc(100vh-5rem)] w-full max-w-screen-md -translate-x-1/2 flex-col overflow-hidden rounded-xl border font-sans outline-none"
            >
              <ChatBoxProvider>
                <div className="flex h-14 flex-shrink-0 items-center px-4">
                  <DialogPrimitives.Title className="font-semibold">
                    Ask AI
                  </DialogPrimitives.Title>
                </div>
                <ChatBox />
              </ChatBoxProvider>
            </DialogPrimitives.Content>
          </DialogPrimitives.Portal>
        </DialogPrimitives.Root>
      </SiteAssistProvider>
    </TailwindCSS>
  );
}
