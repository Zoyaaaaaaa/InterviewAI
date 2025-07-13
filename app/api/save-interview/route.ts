
// // import { createClient } from '@/utils/supabase/server';
// // import { NextResponse } from 'next/server';

// // export async function POST(request: Request) {
// //   const supabase = await createClient();

// //   // Get authenticated user
// //   const {
// //     data: { user },
// //     error: authError,
// //   } = await supabase.auth.getUser();

// //   // Check for authentication errors
// //   if (authError || !user) {
// //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //   }

// //   try {
// //     // Parse the request body
// //     const body = await request.json();
// //     const { conversation } = body;

// //     // Validate the input
// //     if (!conversation || typeof conversation !== "string") {
// //       return NextResponse.json(
// //         { error: "Invalid conversation data" },
// //         { status: 400 }
// //       );
// //     }

// //     // Insert the conversation into the Supabase `interview` table
// //     const { data, error } = await supabase
// //       .from('interview')
// //       .insert({
// //         user_id: user.id, // Use the authenticated user's ID
// //         conversation,
// //       });
      

// //     // Check for insertion errors
// //     if (error) {
// //       throw new Error(error.message);
// //     }

// //     // Return a success response
// //     return NextResponse.json(
// //       { message: "Interview saved successfully", data },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error saving interview:", error);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { createClient } from '@/utils/supabase/server';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   console.log("Received POST request to save interview");

//   // Initialize Supabase client
//   const supabase = await createClient();
//   console.log("Supabase client initialized");

//   // Get authenticated user
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();
//   console.log("Authenticated user fetched:", user);

//   // Check for authentication errors
//   if (authError || !user) {
//     console.error("Authentication error:", authError);
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {

//     const body = await request.json();
//     console.log("Request body parsed:", body);

//     const { conversation } = body;

//     if (!conversation || typeof conversation !== "string") {
//       console.error("Invalid conversation data:", conversation);
//       return NextResponse.json(
//         { error: "Invalid conversation data" },
//         { status: 400 }
//       );
//     }

//     console.log("Valid conversation data received:", conversation);


//     const { data, error } = await supabase
//       .from('interview')
//       .insert({
//         user_id: user.id, 
//         conversation,
//       })
//       .select('id') 
//       .single();
    
//     console.log("Insert operation response:", { data, error });


//     if (error) {
//       console.error("Error inserting data into interview table:", error);
//       throw new Error(error.message);
//     }


//     const interview_id = data.id;
//     console.log("Interview saved successfully with ID:", interview_id);

//     const feedbackResponse = await fetch(` http://localhost:3000/api/feedback/${interview_id}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ interview_id }),
//     });

//     console.log("Feedback API response status:", feedbackResponse.status);

//     // Check if the feedback API call was successful
//     if (!feedbackResponse.ok) {
//       console.error("Error calling feedback API:", await feedbackResponse.text());
//       return NextResponse.json(
//         { error: "Error passing interview ID to feedback API" },
//         { status: 500 }
//       );
//     }

//     console.log("Interview ID passed successfully to feedback API");

//     return NextResponse.json(
//       {
//         message: "Interview saved successfully and passed to feedback API",
//         interview_id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error saving interview or passing to feedback API:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("Received POST request to save interview");

  // Initialize Supabase client
  const supabase = await createClient();
  console.log("Supabase client initialized");

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  console.log("Authenticated user fetched:", user);

  // Check for authentication errors
  if (authError || !user) {
    console.error("Authentication error:", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Request body parsed:", body);

    // Check if messages exists in the body
    if (!body || !body.messages) {
      console.error("Messages data is missing in request body");
      return NextResponse.json(
        { error: "Messages data is required" },
        { status: 400 }
      );
    }

    // Prepare the conversation data
    const conversationData = {
      messages: body.messages,
      resumeData: body.resumeData || null,
      duration: body.duration || null,
      timestamp: body.timestamp || null
    };

    // Stringify the conversation data
    const conversationString = JSON.stringify(conversationData);
    console.log("Processed conversation data:", conversationString);

    // Prepare data for insertion
    const insertData = {
      user_id: user.id,
      conversation: conversationString,
      duration: body.duration || null,
      timestamp: body.timestamp ? new Date(body.timestamp).toISOString() : null,
      resume_data: body.resumeData ? JSON.stringify(body.resumeData) : null
    };

    const { data, error } = await supabase
      .from('interview')
      .insert(insertData)
      .select('id') 
      .single();
    
    if (error) {
      console.error("Error inserting data into interview table:", error);
      throw new Error(error.message);
    }

    const interview_id = data.id;
    console.log("Interview saved successfully with ID:", interview_id);

    const feedbackResponse = await fetch(`http://localhost:3000/api/feedback/${interview_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interview_id }),
    });

    if (!feedbackResponse.ok) {
      console.error("Error calling feedback API:", await feedbackResponse.text());
      return NextResponse.json(
        { error: "Error passing interview ID to feedback API" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Interview saved successfully and passed to feedback API",
        interview_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving interview or passing to feedback API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}