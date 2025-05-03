import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the absolute path to the public/images/Homes2 directory
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'Homes2');
    
    // Read the directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files (you can adjust the extensions as needed)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    // Sort the files numerically
    const sortedImages = imageFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      return numA - numB;
    });

    return NextResponse.json({ images: sortedImages });
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json(
      { error: 'Failed to read images directory' },
      { status: 500 }
    );
  }
} 