import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const files = data.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files uploaded' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the uploads directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Ignore if directory already exists
    }

    const uploadedUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-');
      const filepath = path.join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      
      // Path for client (relative to public)
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ success: false, message: 'Server error during upload' }, { status: 500 });
  }
}
