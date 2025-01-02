import { getChatsByUserId, saveChat } from '@/app/db/queries';
import { openai } from '@ai-sdk/openai';
import { createId } from '@paralleldrive/cuid2';
import { getServerSession } from "next-auth/next";
import { convertToCoreMessages, streamText } from 'ai';
import { authOptions } from '@/app/lib/auth';
import { characterQueries, generateSystemMessage } from '@/app/db/queries';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, characterId } = await req.json();
    const session = await getServerSession(authOptions);
    
    // Fetch character from database
    const character = await characterQueries.getById(characterId);
    if (!character) {
      return new Response('Character not found', { 
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate system message for the character
    const systemMessage = {
      role: 'system' as const,
      content: generateSystemMessage(character)
    };

    // Combine system message with user messages
    const enrichedMessages = [
      systemMessage,
      ...messages
    ];

    const coreMessages = convertToCoreMessages(enrichedMessages);
    const chatId = createId();

    // Only attempt to save chat if user is authenticated
    const onFinish = session?.user?.id 
      ? async ({ responseMessages }: { responseMessages: any[] }) => {
          try {
            const allMessages = [...coreMessages, ...responseMessages];
            await saveChat({
              id: chatId,
              messages: allMessages,
              userId: session.user.id,
              characterId
            });
          } catch (error) {
            console.error('Failed to save chat:', error);
          }
        }
      : undefined;

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: coreMessages,
      onFinish,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Route handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}