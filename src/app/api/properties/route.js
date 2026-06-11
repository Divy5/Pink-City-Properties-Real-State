import { NextResponse } from 'next/server';
import { properties } from '@/data';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('New property listing submitted:', data);
    return NextResponse.json({ success: true, message: 'Property submitted for review', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit property' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, count: properties.length, data: properties });
}
