
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    // Get authenticated user
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

    // Fetch user-specific data
    const { data, error } = await supabase
      .from('user_information')
      .select('*')
      .eq('user_id', user_id)
      .single();
      console.log(data)

    if (error) {
      // If no record found, return empty object instead of error
      if (error.code === 'PGRST116') {
        console.log('No existing user information found for user:', user_id);
        return NextResponse.json(
          { 
            message: 'No existing user information found',
            data: null 
          }, 
          { status: 200 }
        );
      }
      
      console.error('Error fetching user details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Fetched user details:', data);
    return NextResponse.json(
      { 
        message: 'User details fetched successfully',
        data 
      }, 
      { status: 200 }
    );
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

    // Validate required fields
    if (!placement_goal || !preferred_industry || !skill_focus || !interview_preparation) {
      console.error('Validation error: Missing fields', body);
      return NextResponse.json(
        { error: 'All fields (placement_goal, preferred_industry, skill_focus, interview_preparation) are required' },
        { status: 400 }
      );
    }

    // Get authenticated user
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

    // Check if user already has preferences
    const { data: existingData, error: fetchError } = await supabase
      .from('user_information')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing data:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let result;
    let operation;

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_information')
        .update({
          placement_goal,
          preferred_industry,
          skill_focus,
          interview_preparation,
        })
        .eq('user_id', user_id)
        .select();

      if (error) {
        console.error('Error updating user preferences:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
      operation = 'updated';
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('user_information')
        .insert([{
          user_id,
          placement_goal,
          preferred_industry,
          skill_focus,
          interview_preparation,
        }])
        .select();

      if (error) {
        console.error('Error inserting user preferences:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
      operation = 'created';
    }

    console.log(`User preferences ${operation} successfully:`, result);
    return NextResponse.json(
      { 
        message: `User preferences ${operation} successfully!`, 
        data: result?.[0] || result 
      },
      { status: operation === 'created' ? 201 : 200 }
    );
  } catch (error: any) {
    console.error('Unexpected error saving details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { placement_goal, preferred_industry, skill_focus, interview_preparation } = body;

    // Validate required fields
    if (!placement_goal || !preferred_industry || !skill_focus || !interview_preparation) {
      console.error('Validation error: Missing fields', body);
      return NextResponse.json(
        { error: 'All fields (placement_goal, preferred_industry, skill_focus, interview_preparation) are required' },
        { status: 400 }
      );
    }

    // Get authenticated user
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

    // Update user preferences
    const { data, error } = await supabase
      .from('user_information')
      .update({
        placement_goal,
        preferred_industry,
        skill_focus,
        interview_preparation,
      })
      .eq('user_id', user_id)
      .select();

    if (error) {
      console.error('Error updating user preferences:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No user preferences found to update' },
        { status: 404 }
      );
    }

    console.log('User preferences updated successfully:', data);
    return NextResponse.json(
      { 
        message: 'User preferences updated successfully!', 
        data: data[0] 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unexpected error updating details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const supabase = await createClient();

  try {
    // Get authenticated user
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

    // Delete user preferences
    const { data, error } = await supabase
      .from('user_information')
      .delete()
      .eq('user_id', user_id)
      .select();

    if (error) {
      console.error('Error deleting user preferences:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No user preferences found to delete' },
        { status: 404 }
      );
    }

    console.log('User preferences deleted successfully:', data);
    return NextResponse.json(
      { 
        message: 'User preferences deleted successfully!', 
        data: data[0] 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Unexpected error deleting details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}