import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const ALLOWED_EMAILS = [
  'alexomaset711@gmail.com',
  'nevooronni@gmail.com',
  'mika.martikainen@venumia.com'
];

export default withAuth(
  function middleware(req) {
    const email = req.nextauth?.token?.email;
    
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token // Allow any authenticated user through initial check
    },
  }
);

export const config = {
  matcher: ['/characters']
};