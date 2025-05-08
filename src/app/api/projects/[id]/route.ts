import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, categoryId, mainImage, location, year, size, status, images, beforeAfter } = body;

    const project = await prisma.project.update({
      where: { id: params.id },
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
          deleteMany: {},
          create: images?.map((image: { url: string; alt?: string; order?: number }) => ({
            url: image.url,
            alt: image.alt,
            order: image.order || 0
          }))
        },
        beforeAfter: beforeAfter ? {
          upsert: {
            create: {
              before: beforeAfter.before,
              after: beforeAfter.after
            },
            update: {
              before: beforeAfter.before,
              after: beforeAfter.after
            }
          }
        } : {
          delete: true
        }
      },
      include: {
        category: true,
        images: true,
        beforeAfter: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 