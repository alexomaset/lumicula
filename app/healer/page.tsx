// pages/healer.tsx
import Link from "next/link";
import Chat from "../chat/page";

export default function Healer() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Lumicula</div>
      </header>

      <Link href="/chat">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">Image 2</div>
          <p className="mt-4">Get clarity to foggy mind</p>

          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>

      <div className="mt-8 px-8 text-center text-black">
        <p>This is a more descriptive text for this particular connection.</p>
        <p className="font-bold mt-4">Text might have a bold row as well</p>
        <p className="mt-4 text-black">
          This text can be 20-30 lines of text and it can be divided into
          paragraphs.
        </p>
      </div>
    </div>
  );
}
