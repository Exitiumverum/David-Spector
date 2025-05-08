import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        beforeAfter: true
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, categoryId, mainImage, location, year, size, status, images, beforeAfter } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        categoryId,
        mainImage,
        location,
        year,
        size,
        status,
        images: {
          create: images?.map((image: { url: string; alt?: string; order?: number }) => ({
            url: image.url,
            alt: image.alt,
            order: image.order || 0
          }))
        },
        beforeAfter: beforeAfter ? {
          create: {
            before: beforeAfter.before,
            after: beforeAfter.after
          }
        } : undefined
      },
      include: {
        category: true,
        images: true,
        beforeAfter: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 