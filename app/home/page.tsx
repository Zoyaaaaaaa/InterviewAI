// 'use client'

// import React from 'react'
// import { motion } from 'framer-motion'
// import { 
//   ArrowRight, 
//   CheckCircle, 
//   Users, 
//   Brain, 
//   Target, 
//   ChevronRight, 
//   Sparkles, 
//   Award, 
//   Target as TargetIcon 
// } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'

// export default function LandingPage() {
//   return (
//     <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
//       {/* Hero Section */}
//       <header className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20 md:py-32">
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-70 dark:opacity-80"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-center max-w-4xl mx-auto"
//           >
//             <div className="flex justify-center mb-4">
//               <div className="bg-white/20 px-4 py-2 rounded-full inline-flex items-center space-x-2">
//                 <Sparkles className="w-5 h-5 text-yellow-400" />
//                 <span className="text-sm font-medium">AI-Powered Interview Preparation</span>
//               </div>
//             </div>
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//               Master Your Placement Interviews with AI
//             </h1>
//             <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
//               Transform your interview skills with personalized, AI-driven practice sessions that simulate real-world scenarios.
//             </p>
//             <div className="flex justify-center space-x-4">
//                 <Link href='/details'>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-white/90 transition-all"
//               >
//                 Get Started Free <ArrowRight className="ml-2" size={20} />
//               </motion.button>
//               </Link>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-white/10 transition-all"
//               >
//                 Learn More
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </header>

//       {/* Problem Statement */}
//       <section className="py-20 bg-gray-50 dark:bg-gray-800">
//         <div className="container mx-auto px-4">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white"
//           >
//             Bridge the Gap Between Learning and Success
//           </motion.h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { 
//                 icon: Users, 
//                 title: "Personalized Guidance", 
//                 description: "Tailored feedback and practice sessions based on your unique strengths and weaknesses.",
//                 color: "text-purple-500"
//               },
//               { 
//                 icon: Brain, 
//                 title: "Real-World Simulation", 
//                 description: "Experience interview scenarios that closely mimic actual placement interviews.",
//                 color: "text-blue-500"
//               },
//               { 
//                 icon: Target, 
//                 title: "Time-Efficient Learning", 
//                 description: "Maximize your preparation with focused, AI-driven practice sessions.",
//                 color: "text-green-500"
//               },
//             ].map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
//                 className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group"
//               >
//                 <div className={`mb-4 ${item.color} bg-opacity-10 p-3 rounded-full inline-block`}>
//                   <item.icon className="w-8 h-8" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{item.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white"
//           >
//             Supercharge Your Interview Preparation
//           </motion.h2>
          
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="rounded-xl overflow-hidden shadow-2xl"
//             >
//               <Image
//                 src="/placeholder.svg?height=400&width=600"
//                 alt="AI Interview Assistant Demo"
//                 width={600}
//                 height={400}
//                 className="w-full object-cover"
//               />
//             </motion.div>
            
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               <ul className="space-y-6">
//                 {[
//                   "AI-powered mock interviews tailored to your field",
//                   "Instant feedback on your responses and body language",
//                   "Comprehensive performance analytics and improvement tracking",
//                   "Vast question bank covering technical and behavioral aspects",
//                   "Interview strategies and tips from industry experts",
//                 ].map((feature, index) => (
//                   <li key={index} className="flex items-start space-x-3">
//                     <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
//                     <span className="text-gray-700 dark:text-gray-300">{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-20 bg-gray-50 dark:bg-gray-800">
//         <div className="container mx-auto px-4">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white"
//           >
//             Success Stories
//           </motion.h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { name: "Priya S.", company: "Google", quote: "This platform was a game-changer for my interview preparation. I landed my dream job at Google!", icon: Award },
//               { name: "Rahul M.", company: "Microsoft", quote: "The AI-powered mock interviews helped me overcome my nervousness and ace my technical rounds.", icon: TargetIcon },
//               { name: "Ananya K.", company: "Amazon", quote: "The personalized feedback improved my communication skills dramatically. Highly recommended!", icon: Sparkles },
//             ].map((testimonial, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                 className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
//               >
//                 <div className="flex items-start mb-4">
//                   <testimonial.icon className="w-10 h-10 text-purple-500 mr-3 flex-shrink-0" />
//                   <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3 text-white font-semibold">
//                     {testimonial.name[0]}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Placed at {testimonial.company}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="container mx-auto px-4 text-center"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Interview Skills?</h2>
//           <p className="text-xl mb-10 max-w-2xl mx-auto">
//             Join thousands of students who've successfully navigated their placement interviews with our AI-powered platform.
//           </p>
//           <div className="flex justify-center space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-white/90 transition-all"
//             >
//               Start Your Free Trial <ChevronRight className="ml-2" size={20} />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-white/10 transition-all"
//             >
//               Learn More
//             </motion.button>
//           </div>
//         </motion.div>
//       </section>

//     </div>
//   )
// }

"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Users, Brain, Target, ChevronRight, Sparkles, Award, TargetIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="bg-black text-gray-300 font-sans">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-black backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-purple-900/30 backdrop-blur-md px-6 py-3 rounded-full inline-flex items-center space-x-3 border border-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-200">AI-Powered Interview Preparation</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              Master Your Placement Interviews with AI
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto">
              Transform your interview skills with personalized, AI-driven practice sessions that simulate real-world
              scenarios.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/details">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-4 rounded-lg font-semibold flex items-center hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25"
                >
                  Get Started Free <ArrowRight className="ml-2" size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-950/40 border border-purple-500/30 px-8 py-4 rounded-lg font-semibold flex items-center hover:bg-purple-900/30 transition-all backdrop-blur-sm"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Problem Statement */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent"
          >
            Bridge the Gap Between Learning and Success
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Personalized Guidance",
                description: "Tailored feedback and practice sessions based on your unique strengths and weaknesses.",
                color: "text-purple-400",
              },
              {
                icon: Brain,
                title: "Real-World Simulation",
                description: "Experience interview scenarios that closely mimic actual placement interviews.",
                color: "text-purple-300",
              },
              {
                icon: Target,
                title: "Time-Efficient Learning",
                description: "Maximize your preparation with focused, AI-driven practice sessions.",
                color: "text-purple-400",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-b from-purple-950/50 to-black rounded-xl p-8 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all group"
              >
                <div className="mb-6 bg-purple-900/40 p-4 rounded-full inline-block">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-purple-200">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent"
          >
            Supercharge Your Interview Preparation
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/20"
            >
              <Image
                src="/Interview.svg"
                alt="AI Interview Assistant Demo"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ul className="space-y-8">
                {[
                  "AI-powered mock interviews tailored to your field",
                  "Instant feedback on your responses and body language",
                  "Comprehensive performance analytics and improvement tracking",
                  "Vast question bank covering technical and behavioral aspects",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent"
          >
            Success Stories
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya S.",
                company: "Google",
                quote:
                  "This platform was a game-changer for my interview preparation. I landed my dream job at Google!",
                icon: Award,
              },
              {
                name: "Rahul M.",
                company: "Microsoft",
                quote: "The AI-powered mock interviews helped me overcome my nervousness and ace my technical rounds.",
                icon: TargetIcon,
              },
              {
                name: "Ananya K.",
                company: "Amazon",
                quote: "The personalized feedback improved my communication skills dramatically. Highly recommended!",
                icon: Sparkles,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-b from-purple-950/50 to-black rounded-xl p-8 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start mb-6">
                  <testimonial.icon className="w-10 h-10 text-purple-400 mr-4 flex-shrink-0" />
                  <p className="italic text-gray-400">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 flex items-center justify-center mr-4 text-white font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-purple-200">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">Placed at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900/30 to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-400">
            Join thousands of students who have successfully navigated their placement interviews with our AI-powered
            platform.
          </p>
          <div className="flex justify-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-4 rounded-lg font-semibold flex items-center hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25"
            >
              Start Your Free Trial <ChevronRight className="ml-2" size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-950/40 border border-purple-500/30 px-8 py-4 rounded-lg font-semibold flex items-center hover:bg-purple-900/30 transition-all backdrop-blur-sm"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

