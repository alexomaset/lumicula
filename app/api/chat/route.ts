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

    // Ensure user is authenticated
    if (!session?.user?.id) {
      return new Response('Unauthorized', { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

    console.log('Starting new chat:', {
      chatId,
      userId: session.user.id,
      characterId,
      messageCount: messages.length
    });

    const result = await streamText({
      model: openai('gpt-4o'), // Make sure this matches your OpenAI model configuration
      messages: coreMessages,
      onFinish: async ({ responseMessages }) => {
        try {
          const allMessages = [...coreMessages, ...responseMessages];
          await saveChat({
            id: chatId,
            messages: allMessages,
            userId: session.user.id,
            characterId
          });

          console.log('Chat saved successfully:', {
            chatId,
            userId: session.user.id,
            messageCount: allMessages.length
          });
        } catch (error) {
          console.error('Failed to save chat:', error);
          // Consider implementing a retry mechanism or queue system for failed saves
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Route handler error:', error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}