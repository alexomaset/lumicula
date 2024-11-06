// pages/healer.tsx
import Link from "next/link";
import Chat from "../chat/page";
import Image from "next/image";
import celestial from '../public/images/celestial.jpeg'


export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Lumicula</div>
      </header>

      <Link href="/cosmic">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">
            <Image
              src={celestial} // Use your imported image
              alt="Descriptive alt text" // Provide descriptive alt text
              width={400} // Adjust width as needed
              height={400} // Adjust height as needed
              className="object-cover rounded-lg" // Customize as needed
            />
            </div>
          <p className="mt-4">Cosmic Horizons</p>

          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>

      <div className="mt-8 px-8 text-center text-black">
        <p>Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe. With an ethereal presence, she provides deep insight into life's most pressing questions, offering clarity through astrology and intuitive readings. Celestial Oracle may illuminate your path and reveal the secrets of your destiny.</p>
        <p className="font-bold mt-4">Text might have a bold row as well</p>
        <p className="mt-4 text-black">
          This text can be 20-30 lines of text and it can be divided into
          paragraphs.
        </p>
      </div>
    </div>
  );
}
