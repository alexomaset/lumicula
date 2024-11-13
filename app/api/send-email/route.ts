import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

export async function POST(req: Request) {
  try {
    const { email, feedback } = await req.json();
    
    await emailjs.send(
      'service_xppqg5k',
      'template_10d2u7a',
      {
        from_email: email,
        message: feedback,
        to_email: 'your-email@example.com',
      },
      'Kra_Xcv86bnZDwvMb'
    );
    
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}