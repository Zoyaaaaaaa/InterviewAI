// import Hero from "@/components/hero";
// // import Landing from "@/components/Landing";
// import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
// import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

// export default async function Index() {
//   return (
//     <>
//       <Hero />
//       <main className="flex-1 flex flex-col gap-6 px-4">
//         <h2 className="font-medium text-xl mb-4">Next steps</h2>
//         {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//         {/* <Landing/> */}
//       </main>
//     </>
//   );
// }
export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Wanderlust</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Discover new adventures and break out of your routine with our AI-powered local adventure generator.
        </p>
        {/* {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
        <Link href="/activity">
          <Button size="lg" className="mt-4">
            Generate a Wander
          </Button>
        </Link>
      </div>

      {/* Recent Adventures */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Adventures</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add your adventure content here */}
        </CardContent>
      </Card>
    </div>
  );
}