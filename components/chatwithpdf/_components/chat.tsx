"use client";

import { useChat } from "ai/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { updateTokensToChatHistory } from "@/actions/chat.history";
import AppInfo from "@/components/chat/app-info";
import ChatLimitMessage from "@/components/chat/chat-limit-message";
import { BotMessage, UserMessage } from "@/components/chat/message-ui";
import PromptBox from "@/components/chat/prompt-box";
import SignInMessage from "@/components/chat/sign-in-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useControlUsages } from "@/hooks/use-control-usages";
import { App } from "@/lib/bots/types";
import { increaseMessageCount } from "@/lib/message-tracker";
import { cn } from "@/lib/utils";

type Props = {
  initialMessages: any;
  chat_id: string;
  document_id: string;
  document_name: string;
  className?: string;
  metadata: Record<string, any>;
  user: any;
  appInfo: App;
  quotaUsage?: { currentCount: number; limitReached: boolean };
};

export default function Chat({
  initialMessages,
  chat_id,
  document_id,
  document_name,
  className,
  metadata,
  user,
  appInfo,
  quotaUsage,
}: Props) {
  const path = usePathname();
  const router = useRouter();
  const {
    usagesData,
    refetchUsages,
    increaseOfflineMessages,
    offlineMessages,
    showLogin,
    setShowLogin,
  } = useControlUsages({ user, quotaUsage });
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: chatSubmit,
    append,
  } = useChat({
    body: {
      document_id,
      chat_id,
      path,
      record_id: metadata?.record_id,
      document_name: document_name,
    },
    initialMessages: initialMessages,
    api: "/api/chatwithpdf/chat",
    async onFinish(_, { usage }) {
      if (user) {
        if (!usagesData?.limitReached) {
          await increaseMessageCount(user?.id, usagesData?.currentCount!);
          refetchUsages();
        }
        await updateTokensToChatHistory({
          id: chat_id,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
        });
      } else {
        increaseOfflineMessages();
      }
    },
  });
  const bottomDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 2) {
      router.refresh();
    }
  }, [messages, path, router]);

  useEffect(() => {
    if (!user && offlineMessages > 2 && messages.length > 2) {
      setShowLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, offlineMessages, messages, initialMessages]);

  useEffect(() => {
    if (user) {
      setShowLogin(false);
      refetchUsages(); // Refetch usage data when user logs in
    }
  }, [user, setShowLogin, refetchUsages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    chatSubmit(e);
  };

  return (
    <div
      className={cn(
        "relative mx-auto flex h-screen w-full max-w-4xl flex-col",
        className
      )}
    >
      <AppInfo appInfo={appInfo} className="from-transparent" />
      <div className="flex-1 overflow-hidden px-2 md:px-4">
        <ScrollArea className="h-full w-full flex-1 pr-4">
          <div className="flex flex-col gap-4">
            {messages.map((message, index: number) => {
              return (
                <div key={message?.id ?? index} className="my-2">
                  {message.role === "assistant"
                    ? message.content.length > 0 && (
                        <BotMessage
                          botImage={appInfo?.avatar}
                          message={message.content}
                        />
                      )
                    : message.role === "user" && (
                        <UserMessage message={message.content} />
                      )}
                </div>
              );
            })}
            <div ref={bottomDiv} className="pb-0" />
          </div>
        </ScrollArea>
      </div>
      <div className="px-2 py-4 md:px-4">
        {showLogin ? (
          <SignInMessage />
        ) : user && usagesData?.limitReached ? (
          <ChatLimitMessage />
        ) : (
          <PromptBox
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            suggestions={appInfo?.suggestions || []}
            append={append}
          />
        )}
      </div>
    </div>
  );
}
