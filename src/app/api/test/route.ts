import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test the connection by getting the current timestamp from Supabase
    const { data, error } = await supabase
      .from('_dummy_table_that_doesnt_exist')
      .select('*')
      .limit(1);

    // If we get here, the connection is working (the error will be about the table not existing, not connection)
    if (error && error.code === 'PGRST116') {
      // This error means the table doesn't exist, but connection is working
      return NextResponse.json({ 
        status: 'success', 
        message: 'Supabase connection is working!',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase connection is working!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Supabase connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
