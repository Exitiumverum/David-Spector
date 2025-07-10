import { NextRequest, NextResponse } from 'next/server';

// This will be replaced with Supabase calls
export async function GET() {
  try {
    // TODO: Replace with Supabase query
    return NextResponse.json({ projects: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Replace with Supabase insert
    const project = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    // TODO: Replace with Supabase delete
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 