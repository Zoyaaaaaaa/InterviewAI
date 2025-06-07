// 'use client'

// import React from 'react'
// import { motion } from 'framer-motion'
// import { ArrowRight, CheckCircle, Users, Brain, Target, ChevronRight } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import DeployButton from "@/components/deploy-button"
// import { EnvVarWarning } from "@/components/env-var-warning"
// import HeaderAuth from "@/components/header-auth"
// import { ThemeSwitcher } from "@/components/theme-switcher"
// import { hasEnvVars } from "@/utils/supabase/check-env-vars"

// export default function Landing() {
//   return (
//     <div className="min-h-screen bg-background text-foreground font-sans">
//       {/* Header */}
//       <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//         <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//           <div className="flex gap-5 items-center font-semibold">
//             <Link href={"/"}>Interview Assistant AI</Link>
//             <div className="flex items-center gap-2">
//               <DeployButton />
//             </div>
//           </div>
//           {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">
//               Master Your Placement Interviews
//             </h1>
//             <p className="text-xl md:text-2xl mb-8">
//               AI-Powered Practice for Real-World Success
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="btn-primary text-lg"
//             >
//               Get Started Free <ArrowRight className="inline-block ml-2" size={20} />
//             </motion.button>
//           </motion.div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="py-16">
//         <div className="container mx-auto px-4">
//           {/* Problem Statement */}
//           <section className="mb-20">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-3xl md:text-4xl font-bold mb-8 text-center font-poppins text-primary-gradient"
//             >
//               Bridge the Gap Between Learning and Success
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="text-lg text-center max-w-3xl mx-auto mb-12"
//             >
//               Traditional placement preparation methods often fall short, leaving students unprepared for real-world interviews. Our AI-powered platform addresses these challenges head-on.
//             </motion.p>
//             <div className="grid md:grid-cols-3 gap-8">
//               {[
//                 { icon: Users, title: "Personalized Guidance", description: "Tailored feedback and practice sessions based on your unique strengths and weaknesses." },
//                 { icon: Brain, title: "Real-World Simulation", description: "Experience interview scenarios that closely mimic actual placement interviews." },
//                 { icon: Target, title: "Time-Efficient Learning", description: "Maximize your preparation with focused, AI-driven practice sessions." },
//               ].map((item, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
//                   className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg card-hover"
//                 >
//                   <item.icon className="text-purple-400 mb-4" size={40} />
//                   <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                   <p className="text-gray-300">{item.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </section>

//           {/* Features Section */}
//           <section className="mb-20">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-primary-gradient"
//             >
//               Supercharge Your Interview Preparation
//             </motion.h2>
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <Image
//                   src="/placeholder.svg?height=400&width=600"
//                   alt="AI Interview Assistant Demo"
//                   width={600}
//                   height={400}
//                   className="rounded-lg shadow-2xl"
//                 />
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//               >
//                 <ul className="space-y-4">
//                   {[
//                     "AI-powered mock interviews tailored to your field",
//                     "Instant feedback on your responses and body language",
//                     "Comprehensive performance analytics and improvement tracking",
//                     "Vast question bank covering technical and behavioral aspects",
//                     "Interview strategies and tips from industry experts",
//                   ].map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       <CheckCircle className="text-green-400 mr-2 mt-1 flex-shrink-0" size={20} />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </div>
//           </section>

//           {/* Testimonials */}
//           <section className="mb-20">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-primary-gradient"
//             >
//               Success Stories
//             </motion.h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               {[
//                 { name: "Priya S.", company: "Google", quote: "This platform was a game-changer for my interview preparation. I landed my dream job at Google!" },
//                 { name: "Rahul M.", company: "Microsoft", quote: "The AI-powered mock interviews helped me overcome my nervousness and ace my technical rounds." },
//                 { name: "Ananya K.", company: "Amazon", quote: "The personalized feedback improved my communication skills dramatically. Highly recommended!" },
//               ].map((testimonial, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                   className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg card-hover"
//                 >
//                   <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
//                       <span className="font-semibold">{testimonial.name[0]}</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold">{testimonial.name}</p>
//                       <p className="text-sm text-gray-400">Placed at {testimonial.company}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </section>

//           {/* CTA Section */}
//           <section>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-lg p-12 text-center"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Ready to Ace Your Placement Interviews?</h2>
//               <p className="text-xl mb-8">Join thousands of students who've transformed their interview skills with our AI-powered platform.</p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-primary text-lg"
//               >
//                 Start Your Free Trial <ChevronRight className="inline-block ml-2" size={20} />
//               </motion.button>
//             </motion.div>
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//         <p>
//           Powered by{" "}
//           <a
//             href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//             target="_blank"
//             className="font-bold hover:underline"
//             rel="noreferrer"
//           >
//             Supabase
//           </a>
//         </p>
//         <ThemeSwitcher />
//       </footer>
//     </div>
//   )
// }

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Users, Brain, Target, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import DeployButton from "@/components/deploy-button"
import { EnvVarWarning } from "@/components/env-var-warning"
import HeaderAuth from "@/components/header-auth"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { hasEnvVars } from "@/utils/supabase/check-env-vars"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>Interview Assistant AI</Link>
            <div className="flex items-center gap-2">
              <DeployButton />
            </div>
          </div>
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">
              Master Your Placement Interviews
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              AI-Powered Practice for Real-World Success
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg"
            >
              Get Started Free <ArrowRight className="inline-block ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Problem Statement */}
          <section className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-8 text-center font-poppins text-primary-gradient"
            >
              Bridge the Gap Between Learning and Success
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-center max-w-3xl mx-auto mb-12"
            >
              Traditional placement preparation methods often fall short, leaving students unprepared for real-world interviews. Our AI-powered platform addresses these challenges head-on.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "Personalized Guidance", description: "Tailored feedback and practice sessions based on your unique strengths and weaknesses." },
                { icon: Brain, title: "Real-World Simulation", description: "Experience interview scenarios that closely mimic actual placement interviews." },
                { icon: Target, title: "Time-Efficient Learning", description: "Maximize your preparation with focused, AI-driven practice sessions." },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg card-hover"
                >
                  <item.icon className="text-purple-400 mb-4" size={40} />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-primary-gradient"
            >
              Supercharge Your Interview Preparation
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="AI Interview Assistant Demo"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ul className="space-y-4">
                  {[
                    "AI-powered mock interviews tailored to your field",
                    "Instant feedback on your responses and body language",
                    "Comprehensive performance analytics and improvement tracking",
                    "Vast question bank covering technical and behavioral aspects",
                    "Interview strategies and tips from industry experts",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-400 mr-2 mt-1 flex-shrink-0" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-primary-gradient"
            >
              Success Stories
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Priya S.", company: "Google", quote: "This platform was a game-changer for my interview preparation. I landed my dream job at Google!" },
                { name: "Rahul M.", company: "Microsoft", quote: "The AI-powered mock interviews helped me overcome my nervousness and ace my technical rounds." },
                { name: "Ananya K.", company: "Amazon", quote: "The personalized feedback improved my communication skills dramatically. Highly recommended!" },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg card-hover"
                >
                  <p className="text-gray-300 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                      <span className="font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">Placed at {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-lg p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Ready to Ace Your Placement Interviews?</h2>
              <p className="text-xl mb-8">Join thousands of students who&apos;ve transformed their interview skills with our AI-powered platform.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg"
              >
                Start Your Free Trial <ChevronRight className="inline-block ml-2" size={20} />
              </motion.button>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </div>
  )
}