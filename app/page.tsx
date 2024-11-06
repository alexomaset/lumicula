// eslint-disable-next-line @typescript-eslint/no-unused-vars

import Image from "next/image";
import bg from "./public/images/bg.jpg";
import Link from "next/link";
import Healer from "./healer/page";
import image from "next/image";
import celestial from '../public/images/celestial.jpeg'

const characters = [
  { title: "Celestial Oracle", path: "/celestial-ui"},
  { title: "Stellar Wisdom", path: "/stellar-ui" },
  { title: "Ethereal Visions", path: "/etherial-ui" },
  { title: "Divine Pathways", path: "/divine-ui" },
  { title: "Cosmic Horizons", path: "/cosmic-ui" },
  { title: "Fate Whisperer", path: "/fate-ui" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-amber-50">
      {/* Main Section */}
      <main className="flex flex-col items-center text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 mt-8">
        {characters.map(({ title, path }) => (
            <Link href={path} key={title}>
              <div className="flex flex-col items-center bg-white p-4">
                <div className="w-full h-32 bg-stone-400 flex items-center justify-center overflow-hidden">
                  <Image
                    src={bg}
                    alt="place holder"
                    className="object-contain h-full w-full"
                    width={400}
                    height={328}
                  />
                </div>
                <p className="mt-4 text-center text-black">{title}</p>
                <button className="mt-4 bg-black hover:text-yellow-300 active:bg-blue-8k00 text-white py-2 px-4 rounded">
                  Connect
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
