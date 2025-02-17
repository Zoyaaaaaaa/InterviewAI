
import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { ChevronRight, Grid, Home, User } from "lucide-react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Interview AI Prep",
  description: "AI-Powered Interview Preparation Platform",
};

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={GeistSans.className} suppressHydrationWarning>
//       <body className="bg-dark-purple dark:bg-black text-white min-h-screen flex flex-col">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           {/* Header */}
//           <nav className="sticky top-0 z-50 bg-dark-purple/90 dark:bg-black/90 backdrop-blur-md shadow-lg">
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//               <Link
//                 href="/"
//                 className="flex items-center space-x-2 text-xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
//               >
//                 <Home className="w-6 h-6" />
//                 <span>InterviewAI</span>
//               </Link>

//               <div className="flex items-center space-x-6">
//                 <div className="flex space-x-4 items-center">
//                   <Link
//                     href="/profile"
//                     className="flex items-center space-x-1 text-gray-300 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm">Profile</span>
//                   </Link>
//                 </div>

//                 {/* Theme Switcher and Login */}
//                 <div className="flex items-center space-x-4">
//                   <ThemeSwitcher />
//                   <Link
//                     href="/sign-in"
//                     className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </nav>

//           {/* Main Content */}
//           {/* <main className="flex-grow container mx-auto px-4 py-8">{children}</main> */}
//           <main className="flex-grow w-full p-8">{children}</main>


//           {/* Footer */}
//           <footer className="bg-dark-purple dark:bg-black py-12">
//             <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
//               {/* Company Info */}
//               <div>
//                 <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">InterviewAI</h3>
//                 <p className="text-sm text-gray-300 dark:text-gray-400">
//                   Revolutionizing interview preparation with AI-powered solutions.
//                 </p>
//               </div>

//               {/* Quick Links */}
//               <div>
//                 <h4 className="font-semibold mb-4 text-gray-200 dark:text-white">Quick Links</h4>
//                 <div className="space-y-2">
//                   <Link
//                     href="/features"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Features
//                   </Link>
//                   <Link
//                     href="/pricing"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Pricing
//                   </Link>
//                   <Link
//                     href="/support"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Support
//                   </Link>
//                 </div>
//               </div>

//               {/* Contact */}
//               <div>
//                 <h4 className="font-semibold mb-4 text-gray-200 dark:text-white">Contact</h4>
//                 <div className="text-sm text-gray-300 dark:text-gray-400 space-y-2">
//                   <p>Email: support@interviewai.com</p>
//                   <p>Phone: +1 (123) 456-7890</p>
//                 </div>
//               </div>
//             </div>

//             {/* Copyright */}
//             <div className="text-center mt-8 pt-6 border-t border-gray-600 dark:border-gray-700 text-sm text-gray-300 dark:text-gray-400">
//               © 2024 InterviewAI. All Rights Reserved.
//             </div>
//           </footer>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   return (
//     <html lang="en" className={GeistSans.className} suppressHydrationWarning>
//       <body className="bg-dark-purple dark:bg-black text-white min-h-screen flex flex-col">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           {/* Header - Made responsive */}
//           <nav className="sticky top-0 z-50 bg-dark-purple/90 dark:bg-black/90 backdrop-blur-md shadow-lg">
//             <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
//               <Link
//                 href="/"
//                 className="flex items-center space-x-2 text-xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
//               >
//                 <Home className="w-6 h-6" />
//                 <span>InterviewAI</span>
//               </Link>

//               <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                 <div className="flex space-x-4 items-center">
//                   <Link
//                     href="/profile"
//                     className="flex items-center space-x-1 text-gray-300 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm">Profile</span>
//                   </Link>
//                 </div>

//                 {/* Theme Switcher and Login - Responsive layout */}
//                 <div className="flex items-center space-x-4">
//                   <ThemeSwitcher />
//                   <Link
//                     href="/sign-in"
//                     className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </nav>

//           {/* Main Content - Full width with padding */}
//           <main className="flex-grow w-full px-4 sm:px-8 py-8">{children}</main>

//           {/* Footer - Responsive grid */}
//           <footer className="bg-dark-purple dark:bg-black py-12">
//             <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* Company Info */}
//               <div className="text-center md:text-left">
//                 <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">InterviewAI</h3>
//                 <p className="text-sm text-gray-300 dark:text-gray-400">
//                   Revolutionizing interview preparation with AI-powered solutions.
//                 </p>
//               </div>

//               {/* Quick Links - Stacked on mobile */}
//               <div className="text-center md:text-left">
//                 <h4 className="font-semibold mb-4 text-gray-200 dark:text-white">Quick Links</h4>
//                 <div className="space-y-2">
//                   <Link
//                     href="/features"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Features
//                   </Link>
//                   <Link
//                     href="/pricing"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Pricing
//                   </Link>
//                   <Link
//                     href="/support"
//                     className="text-sm text-gray-300 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center md:justify-start"
//                   >
//                     <ChevronRight className="w-4 h-4 mr-1" /> Support
//                   </Link>
//                 </div>
//               </div>

//               {/* Contact - Centered on mobile */}
//               <div className="text-center md:text-left">
//                 <h4 className="font-semibold mb-4 text-gray-200 dark:text-white">Contact</h4>
//                 <div className="text-sm text-gray-300 dark:text-gray-400 space-y-2">
//                   <p>Email: zoya@interviewai.com</p>
//                   {/* <p>Phone: +1 (123) 456-7890</p> */}
//                 </div>
//               </div>
//             </div>

//             {/* Copyright - Centered */}
//             <div className="text-center mt-8 pt-6 border-t border-gray-600 dark:border-gray-700 text-sm text-gray-300 dark:text-gray-400">
//               © 2024 InterviewAI. All Rights Reserved.
//             </div>
//           </footer>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
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