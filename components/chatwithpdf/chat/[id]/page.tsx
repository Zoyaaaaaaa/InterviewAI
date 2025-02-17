import { IconLoader2 } from "@tabler/icons-react";
import { getAppInfo } from "@/actions/apps.actions";
import { getUserDetails } from "@/actions/auth";
import { getRecord } from "@/actions/chat-with-pdf.actions";
import { getChats } from "@/actions/chat.history";
import { checkUserUsage } from "@/lib/message-tracker";
import Chat from "../../_components/chat";
import PDFViewer from "../../_components/pdf-viewer";
import { Record } from "../../_types";

type Props = {
  params: {
    id: string;
  };
};

export default async function ChatPage({ params: { id } }: Props) {
  const { data: chats } = await getChats({ app_slug: "chatwithpdf", id });
  const record: Record = await getRecord(chats.metadata?.record_id!);
  const user = await getUserDetails();
  const { currentCount, limitReached } = await checkUserUsage(user?.id || "");
  const appInfo = await getAppInfo("chatwithpdf");

  if (!chats || !record)
    return (
      <div className="grid h-screen place-items-center">
        <IconLoader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  return (
    <div className="flex flex-1">
      <Chat
        initialMessages={chats.messages}
        chat_id={id}
        document_id={record.document_id}
        document_name={record.document_name}
        metadata={chats.metadata}
        user={user}
        quotaUsage={{ currentCount, limitReached }}
        appInfo={appInfo}
      />
      <PDFViewer className="hidden lg:block" url={record.document_url} />
    </div>
  );
}
