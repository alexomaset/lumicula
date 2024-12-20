'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}