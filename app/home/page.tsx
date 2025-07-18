// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import { ArrowRight, CheckCircle, Users, Brain, Target, ChevronRight, Sparkles, Upload, FileText, Briefcase, Star, Award, TrendingUp } from "lucide-react"

// export default function EliteLandingPage() {
//   const [hoveredCard, setHoveredCard] = useState(null)

//   return (
//     <div className="bg-black text-gray-100 font-sans overflow-hidden">
//       {/* Hero Section */}
//       <header className="relative py-32 md:py-40">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900/20"></div>
//         <div className="absolute top-0 left-0 w-full h-full">
//           <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
//           <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
//         </div>
        
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="text-center max-w-5xl mx-auto"
//           >
//             <div className="flex justify-center mb-8">
//               <div className="bg-gray-800/80 backdrop-blur-md px-8 py-4 rounded-full inline-flex items-center space-x-3 border border-purple-500/30 shadow-2xl">
//                 <Sparkles className="w-6 h-6 text-purple-400" />
//                 <span className="text-sm font-medium text-purple-300">Next-Generation Interview Intelligence</span>
//               </div>
//             </div>
            
//             <h1 className="text-6xl md:text-8xl font-light mb-10 leading-tight">
//               <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent font-extralight">
//                 Elite Interview
//               </span>
//               <br />
//               <span className="text-gray-300 font-thin">
//                 Mastery Platform
//               </span>
//             </h1>
            
//             <p className="text-xl md:text-2xl mb-16 text-gray-400 max-w-4xl mx-auto font-light leading-relaxed">
//               Elevate your career potential with AI-powered interview preparation that adapts to your unique profile and target positions.
//             </p>
            
//             <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
//               <motion.button
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-medium flex items-center shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
//               >
//                 Begin Your Journey <ArrowRight className="ml-3" size={20} />
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="bg-gray-800/80 backdrop-blur-md border border-purple-500/30 text-purple-300 px-10 py-5 rounded-2xl font-medium flex items-center shadow-xl hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300"
//               >
//                 Explore Features
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </header>

//       {/* Personalization Section */}
//       <section className="py-24 bg-gradient-to-b from-black to-gray-900/50">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-20"
//           >
//             <h2 className="text-5xl md:text-6xl font-light mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
//               Personalized Excellence
//             </h2>
//             <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
//               Upload your resume and job descriptions to receive tailored interview preparation that matches your exact career goals.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-purple-500/20 border border-purple-500/20 hover:shadow-purple-500/30 hover:border-purple-400/30 transition-all duration-500"
//             >
//               <div className="flex items-center mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
//                   <FileText className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-semibold text-gray-200">Resume Analysis</h3>
//                   <p className="text-gray-400">AI-powered profile optimization</p>
//                 </div>
//               </div>
              
//               <div className="border-2 border-dashed border-purple-500/40 rounded-2xl p-8 text-center hover:border-purple-400/60 transition-colors cursor-pointer bg-gray-900/30">
//                 <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
//                 <p className="text-gray-300 font-medium">Upload Your Resume</p>
//                 <p className="text-sm text-gray-500 mt-2">PDF, DOC, or TXT format</p>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-purple-500/20 border border-purple-500/20 hover:shadow-purple-500/30 hover:border-purple-400/30 transition-all duration-500"
//             >
//               <div className="flex items-center mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
//                   <Briefcase className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-semibold text-gray-200">Job Matching</h3>
//                   <p className="text-gray-400">Role-specific preparation</p>
//                 </div>
//               </div>
              
//               <div className="border-2 border-dashed border-indigo-500/40 rounded-2xl p-8 text-center hover:border-indigo-400/60 transition-colors cursor-pointer bg-gray-900/30">
//                 <Briefcase className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
//                 <p className="text-gray-300 font-medium">Add Job Description</p>
//                 <p className="text-sm text-gray-500 mt-2">Paste or upload job requirements</p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 bg-black">
//         <div className="container mx-auto px-4">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-5xl md:text-6xl font-light mb-20 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
//           >
//             Premium Features
//           </motion.h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Brain,
//                 title: "AI Interview Coach",
//                 description: "Advanced neural networks analyze your responses and provide real-time coaching for optimal performance.",
//                 color: "from-purple-600 to-indigo-600",
//               },
//               {
//                 icon: Target,
//                 title: "Precision Targeting",
//                 description: "Laser-focused preparation based on your specific role, industry, and career level requirements.",
//                 color: "from-indigo-600 to-purple-600",
//               },
//               {
//                 icon: TrendingUp,
//                 title: "Performance Analytics",
//                 description: "Comprehensive insights and progress tracking with detailed performance metrics and improvement recommendations.",
//                 color: "from-purple-600 to-pink-600",
//               },
//             ].map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
//                 onHoverStart={() => setHoveredCard(index)}
//                 onHoverEnd={() => setHoveredCard(null)}
//                 className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-purple-500/20 border border-purple-500/20 hover:shadow-purple-500/30 hover:border-purple-400/30 transition-all duration-500 transform hover:-translate-y-2"
//               >
//                 <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
//                   <item.icon className="w-10 h-10 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-semibold mb-4 text-gray-200">{item.title}</h3>
//                 <p className="text-gray-400 leading-relaxed">{item.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Excellence Indicators */}
//       <section className="py-24 bg-gradient-to-br from-gray-900 to-black">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-20"
//           >
//             <h2 className="text-5xl md:text-6xl font-light mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
//               Proven Excellence
//             </h2>
//           </motion.div>

//           <div className="grid md:grid-cols-4 gap-8">
//             {[
//               { number: "95%", label: "Success Rate", icon: Award },
//               { number: "10K+", label: "Interviews Aced", icon: Target },
//               { number: "500+", label: "Top Companies", icon: Star },
//               { number: "24/7", label: "AI Support", icon: Brain },
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
//                 className="text-center bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-purple-500/20 border border-purple-500/20 hover:shadow-purple-500/30 hover:border-purple-400/30 transition-all duration-500"
//               >
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <stat.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <div className="text-4xl font-light text-purple-400 mb-2">{stat.number}</div>
//                 <div className="text-gray-400 font-medium">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 bg-gradient-to-br from-purple-600 to-indigo-600">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="container mx-auto px-4 text-center"
//         >
//           <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
//             Ready to Excel?
//           </h2>
//           <p className="text-xl mb-16 max-w-3xl mx-auto text-purple-100 font-light leading-relaxed">
//             Join the elite circle of professionals who have transformed their careers with our AI-powered interview mastery platform.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
//             <motion.button
//               whileHover={{ scale: 1.02, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               className="bg-white text-purple-600 px-10 py-5 rounded-2xl font-medium flex items-center shadow-2xl hover:shadow-3xl transition-all duration-300"
//             >
//               Start Your Elite Journey <ChevronRight className="ml-3" size={20} />
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.02, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-medium flex items-center hover:bg-white/20 transition-all duration-300"
//             >
//               Schedule Demo
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
import { ArrowRight, CheckCircle, Users, Brain, Target, ChevronRight, Sparkles} from "lucide-react"
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

