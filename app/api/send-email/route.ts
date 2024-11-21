import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

export async function POST(req: Request) {
  try {
    const { email, feedback } = await req.json();
    
    await emailjs.send(
      'service_6unx3hx',
      'template_by0lz9s',
      {
        from_email: email,
        message: feedback,
        to_email: 'your-email@example.com',
      },
      'kr-RN1C8oifSvgJQW'
    );
    
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}