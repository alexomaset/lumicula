import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Character Not Found</h2>
        <p className="text-gray-600 mb-4">
          The character youre looking for doesnt exist or has been removed.
        </p>
        <Link 
          href="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}