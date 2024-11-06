// pages/healer.tsx
import Link from "next/link";
import Image from "next/image";
import ethereal from "../public/images/ethereal.jpeg";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Lumicula</div>
      </header>

      <Link href="/etherial">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">
            {" "}
            <Image
              src={ethereal} // Use your imported image
              alt="Descriptive alt text" // Provide descriptive alt text
              width={400} // Adjust width as needed
              height={400} // Adjust height as needed
              className="object-cover rounded-lg" // Customize as needed
            />
          </div>
          <p className="mt-4">Ethereal Visions</p>

          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>

      <div className="mt-8 px-8 text-center text-black">
        <p>
          Ethereal Visions is a wise, visionary guide who empowers users to
          recognize the impact of their actions and choices on their future.
          Through thoughtful, insightful conversations, this character helps
          users unlock their hidden potential and provides guidance on how to
          manifest their desired life. Ethereal Visions is both practical and
          reflective, blending inspiration with actionable advice to encourage
          growth and self-discovery..
        </p>
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
