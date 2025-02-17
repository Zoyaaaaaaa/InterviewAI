// app/api/feedback/route.ts

// import { NextResponse } from 'next/server'
// import { createClient } from "@/utils/supabase/server";
// export async function GET() {
//   try {
//      const supabase=await createClient()
    
//     // Get user ID from session
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Fetch all feedback entries joined with interviews for this user
//     const { data: feedbackData, error: feedbackError } = await supabase
//       .from('feedback')
//       .select(`
//         id,
//         technical_score,
//         communication_score,
//         confidence_score,
//         overall_score,
//         created_at,
//         interview_id,
//         interview!inner (user_id)
//       `)
//       .eq('interview.user_id', user.id)
//       .order('created_at', { ascending: true })

//     if (feedbackError) {
//       return NextResponse.json({ error: feedbackError.message }, { status: 500 })
//     }

//     // Transform scores from 0-1 to 0-10 scale and format data
//     const formattedFeedback = feedbackData.map(feedback => ({
//       id: feedback.id,
//       created_at: feedback.created_at,
//       technical_score: feedback.technical_score * 10,
//       communication_score: feedback.communication_score * 10,
//       confidence_score: feedback.confidence_score * 10,
//       overall_score: feedback.overall_score * 10
//     }))

//     return NextResponse.json(formattedFeedback)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     )
//   }
// }

// app/api/feedback/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server'
import { Feedback } from '@/types/feedback'

export async function GET(): Promise<NextResponse<Feedback[] | { error: string }>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select(`
        id,
        technical_score,
        communication_score,
        confidence_score,
        overall_score,
        created_at,
        interview_id,
        interview!inner (user_id)
      `)
      .eq('interview.user_id', user.id)
      .order('created_at', { ascending: true })

    if (feedbackError) {
      return NextResponse.json({ error: feedbackError.message }, { status: 500 })
    }

    const formattedFeedback: Feedback[] = (feedbackData || []).map((feedback: { id: any; created_at: any; technical_score: number; communication_score: number; confidence_score: number; overall_score: number }) => ({
      id: feedback.id,
      created_at: feedback.created_at,
      technical_score: feedback.technical_score * 10,
      communication_score: feedback.communication_score * 10,
      confidence_score: feedback.confidence_score * 10,
      overall_score: feedback.overall_score * 10
    }))

    return NextResponse.json(formattedFeedback)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}