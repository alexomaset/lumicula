import Image from "next/image";
import Link from "next/link";
import celestial from "./public/images/celestial.jpeg";
import stellar from "./public/images/stellar.jpeg";
import ethereal from "./public/images/ethereal.jpeg";
import fate from "./public/images/fate.jpeg";
import cosmic from "./public/images/comsic.jpeg";
import divine from "./public/images/divine.jpeg";
import Footer from "./footer/page";

const characterImages = {
  "Celestial Oracle": celestial,
  "Stellar Wisdom": stellar,
  "Ethereal Visions": ethereal,
  "Divine Pathways": divine,
  "Cosmic Horizons": cosmic,
  "Fate Whisperer": fate,
};
const characters = [
  {
    title: "Celestial Oracle",
    path: "/celestial-ui",
    image: characterImages["Celestial Oracle"],
  },
  {
    title: "Stellar Wisdom",
    path: "/stellar-ui",
    image: characterImages["Stellar Wisdom"],
  },
  {
    title: "Ethereal Visions",
    path: "/etherial-ui",
    image: characterImages["Ethereal Visions"],
  },
  {
    title: "Divine Pathways",
    path: "/divine-ui",
    image: characterImages["Divine Pathways"],
  },
  {
    title: "Cosmic Horizons",
    path: "/cosmic-ui",
    image: characterImages["Cosmic Horizons"],
  },
  {
    title: "Fate Whisperer",
    path: "/fate-ui",
    image: characterImages["Fate Whisperer"],
  },
];

export default function Home() {
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-amber-50">
      {/* Main Section */}
      <main className="flex flex-col items-center text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 mt-8">
          {characters.map(({ title, path, image }) => (
            <Link href={path} key={title}>
              <div className="flex flex-col items-center bg-white p-6 w-80">
                <div className="w-full h-48 bg-stone-400 flex items-center justify-center overflow-hidden">
                  <Image
                    src={image}
                    alt="place holder"
                    className="object-cover h-full w-full"
                    width={600}
                    height={300}
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
    <Footer />
    </>
  );
}
