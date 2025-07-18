
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";

import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";

import Link from "next/link";
import { ChevronRight, Home, User } from "lucide-react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Interview AI Prep",
  description: "AI-Powered Interview Preparation Platform",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

return (
  <html lang="en" className={GeistSans.className} suppressHydrationWarning>
    <body className="bg-black text-white min-h-screen flex flex-col">
      
        <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-purple-400 hover:text-purple-500 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span>InterviewAI</span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* profile */}
              <div className="flex space-x-4 items-center">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-gray-200 hover:text-purple-400 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
               
                <Link
                  href="/sign-in"
                  className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow w-full px-4 sm:px-8 py-8">{children}</main>

        <footer className="bg-black py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-purple-400 mb-4">InterviewAI</h3>
              <p className="text-sm text-gray-400">
                Revolutionizing interview preparation with AI-powered solutions.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  href="/features"
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Pricing
                </Link>
                <Link
                  href="/support"
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
                >
                  <ChevronRight className="w-4 h-4 mr-1" /> Support
                </Link>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <p>Email: zoya@interviewai.com</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
            © 2024 InterviewAI. All Rights Reserved.
          </div>
        </footer>
      
    </body>
  </html>
);
};