import { getChatsByUserId } from "@/app/db/queries";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get and validate userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Ensure user can only access their own chats
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Fetch chats with pagination support
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const chats = await getChatsByUserId(userId);
    
    // Add pagination metadata
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedChats = chats.slice(startIndex, endIndex);

    return NextResponse.json({
      chats: paginatedChats,
      pagination: {
        total: chats.length,
        page,
        limit,
        totalPages: Math.ceil(chats.length / limit)
      }
    });

  } catch (error) {
    console.error('Error in /api/history route:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}