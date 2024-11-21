import { getChatsByUserId } from "@/app/db/queries";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        // Get the server-side session
        const session = await getServerSession(authOptions);
        
        // Get userId from query params
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
    
        // Validate userId
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
    
        // If no authenticated session, only allow fetching for the current userId
        if (!session?.user?.id) {
          return NextResponse.json({ chats: [], message: 'Unauthenticated access limited' });
        }
    
        // Ensure the requesting user can only fetch their own chats
        if (session.user.id !== userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
    
        // Fetch chats for the user
        const chats = await getChatsByUserId(userId);
        
        // Return chats
        return NextResponse.json(chats);
      } catch (error) {
        console.error('Error in /api/history route:', error);
        return NextResponse.json(
          { error: 'Internal Server Error' }, 
          { status: 500 }
        );
      }
}