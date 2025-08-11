import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, slug, imageUrl, author, isPublished } = body;

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists for other posts
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Blog post with this slug already exists' },
        { status: 400 }
      );
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        slug,
        imageUrl,
        author,
        isPublished: isPublished !== undefined ? isPublished : false,
        publishedAt: isPublished ? new Date() : null
      }
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the post
    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}