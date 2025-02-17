
// import { NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server';

// export async function GET() {
//   const supabase = await createClient();

//   try {
//     const { data, error } = await supabase.from('user_information').select('*');

//     if (error) {
//       console.error('Error fetching details:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     console.log('Fetched details:', data);
//     return NextResponse.json(data, { status: 200 });
//   } catch (error: any) {
//     console.error('Unexpected error fetching details:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// export async function POST(req: Request) {
//   const supabase = await createClient();

//   try {
//     const body = await req.json();
//     const { placement_goal, preferred_industry, skill_focus, interview_preparation } = body;

//     // Validate fields
//     if (!placement_goal || !preferred_industry || !skill_focus || !interview_preparation) {
//       console.error('Validation error: Missing fields', body);
//       return NextResponse.json(
//         { error: 'All fields (placement_goal, preferred_industry, skill_focus, interview_preparation) are required' },
//         { status: 400 }
//       );
//     }

//     // Insert into Supabase
//     const { data, error } = await supabase.from('user_information').insert([
//       { placement_goal, preferred_industry, skill_focus, interview_preparation }
//     ]);

//     if (error) {
//       console.error('Error inserting details:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     console.log('Inserted details successfully:', data);
//     return NextResponse.json({ message: 'Details saved successfully!', data }, { status: 201 });
//   } catch (error: any) {
//     console.error('Unexpected error saving details:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('user_information').select('*');

    if (error) {
      console.error('Error fetching details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Fetched details:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error fetching details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { placement_goal, preferred_industry, skill_focus, interview_preparation } = body;

    // Validate fields
    if (!placement_goal || !preferred_industry || !skill_focus || !interview_preparation) {
      console.error('Validation error: Missing fields', body);
      return NextResponse.json(
        { error: 'All fields (placement_goal, preferred_industry, skill_focus, interview_preparation) are required' },
        { status: 400 }
      );
    }

    // Fetch user ID from the authenticated session
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      console.error('Authentication error:', sessionError || 'No user found');
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // Insert into Supabase
    const { data, error } = await supabase.from('user_information').insert([
      { user_id, placement_goal, preferred_industry, skill_focus, interview_preparation },
    ]);

    if (error) {
      console.error('Error inserting details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Inserted details successfully:', data);
    return NextResponse.json({ message: 'Details saved successfully!', data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error saving details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
