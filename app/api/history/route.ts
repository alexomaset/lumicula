import { getChatsByUserId } from "@/app/db/queries";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' }, 
        { status: 403 }
      );
    }

    const chats = await getChatsByUserId(userId);
    
    // Additional validation of chat data
    const validatedChats = chats.map(chat => ({
      ...chat,
      messages: chat.messages?.filter(msg => 
        msg?.role && 
        msg?.content && 
        msg?.timestamp
      ) || []
    }));

    return NextResponse.json({
      chats: validatedChats,
      count: validatedChats.length
    });

  } catch (error) {
    console.error('Error in /api/history route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}