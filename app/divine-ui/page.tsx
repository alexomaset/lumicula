// pages/healer.tsx
import Link from "next/link";
import Chat from "../chat/page";
import Image from "next/image";
import divine from "../public/images/WhatsApp Image 2024-11-06 at 10.28.40.jpeg"

export default function Healer() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Lumicula</div>
      </header>

      <Link href="/divine-pathways">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400"> <Image
              src={divine} // Use your imported image
              alt="Descriptive alt text" // Provide descriptive alt text
              width={400} // Adjust width as needed
              height={400} // Adjust height as needed
              className="object-cover rounded-lg" // Customize as needed
            /></div>
          <p className="mt-4">Divine Pathways</p>

          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>

      <div className="mt-8 px-8 text-center text-black">
        <p>Divine Pathways is a compassionate healer who guides individuals through the complex journey of love and relationships. With gentle wisdom and intuitive insight, she offers healing and clarity, helping people reconnect with their true selves and find harmony in their emotional connections.</p>
        <p className="font-bold mt-4">Text might have a bold row as well</p>
        <p className="mt-4 text-black">
          This text can be 20-30 lines of text and it can be divided into
          paragraphs.
        </p>
      </div>
    </div>
  );
}
