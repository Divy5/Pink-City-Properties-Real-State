import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('New lead received:', data);
    return NextResponse.json({ success: true, message: 'Lead captured successfully', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to capture lead' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Leads API is running' });
}
