import { getAppInfo } from "@/actions/apps.actions";
import { getUserDetails } from "@/actions/auth";
import AppInfo from "@/components/chat/app-info";
import { checkUserUsage } from "@/lib/message-tracker";
import { createClient } from "@/utils/supabase/server";
import { Dropbox } from "./_components/dropbox";

export default async function ChatwithPdfPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const appInfo = await getAppInfo("chatwithpdf");
  const userDetails = await getUserDetails();
  const { limitReached } = await checkUserUsage(userDetails?.id || "");

  return (
    <div className="relative flex flex-1 flex-col">
      <AppInfo appInfo={appInfo} />
      <div className="relative flex flex-1 flex-col justify-center">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Chat with PDF
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Chat directly with PDF documents, extracting insights and sparking
          ideas previously left undiscovered.
        </p>
        <Dropbox user={user} limitReached={limitReached} />
      </div>
    </div>
  );
}
