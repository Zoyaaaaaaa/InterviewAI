import Preferences from '@/components/UserDetails'
import { Rocket } from 'lucide-react'
import React from 'react'

const page = () => {
  return (

       <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="text-purple-400 mr-3" size={40} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
               Get Ready!
            </h1>
          </div>
          <p className="text-purple-300/80 text-lg max-w-2xl mx-auto">
            Time to set up your personalized interview experience. Every detail matters in your journey to success! 🚀
          </p>
        </div>
      
      <Preferences/>
      
      </div>
  )
}

export default page