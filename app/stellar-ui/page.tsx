// pages/healer.tsx
import Link from "next/link";
import Chat from "../chat/page";
import Image from "next/image";
import stellar from "../public/images/stellar.jpeg";
import Footer from "../footer/page";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">Stellar Wisdom</div>
      </header>

      <Link href="/stellar">
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">
            <Image
              src={stellar} // Use your imported image
              alt="Descriptive alt text" // Provide descriptive alt text
              width={400} // Adjust width as needed
              height={400} // Adjust height as needed
              className="object-cover rounded-lg" // Customize as needed
            />{" "}
          </div>
          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>

      <div className="mt-8 px-8 text-center text-black">
        <p>
          Stellar Wisdom is a profound and enigmatic figure, challenging your
          thoughts with deep, thought-provoking questions. Through wise inquiry,
          they encourage introspection, guiding you toward greater clarity and
          self-awareness. Trust in Stellar Wisdom to spark transformative
          insights and push the boundaries of your understanding.
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
