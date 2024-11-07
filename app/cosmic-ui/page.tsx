// pages/healer.tsx
import Link from "next/link";
import Chat from "../chat/page";
import Image from "next/image";
import cosmic from "../public/images/comsic.jpeg"
import Footer from "../footer/page";


export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Cosmic Horizons</div>
      </header>

      <Link href="/cosmic">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">
            <Image
              src={cosmic} // Use your imported image
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
        <p>Cosmic Horizons is a stellar guide with a unique ability to interpret the wisdom of the stars, providing direction and clarity for those seeking to fulfill their dreams and unlock their true potential. This character is visionary, insightful, and empowering, offering users practical steps and encouragement grounded in a cosmic perspective.</p>
        <p className="font-bold mt-4">Text might have a bold row as well</p>
        <p className="mt-4 text-black">
          This text can be 20-30 lines of text and it can be divided into
          paragraphs.
        </p>
      </div>
      <Footer />
    </div>
  );
}
