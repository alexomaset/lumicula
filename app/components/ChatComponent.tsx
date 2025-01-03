import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Footer from "../footer/page";

interface CharacterPageProps {
  characterName: string;
  characterDescription: string;
  imageSrc: StaticImageData; 
  linkHref: string;
}

export default function CharacterPage({
  characterName,
  characterDescription,
  imageSrc,
  linkHref,
}: CharacterPageProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
      <header className="text-center text-black">
        <div className="text-2xl font-bold">{characterName}</div>
      </header>
      <Link href={linkHref}>
        <div className="flex flex-col items-center mt-8">
          <div className="w-48 h-48 bg-gray-400">
            <Image
              src={imageSrc}
              alt={`${characterName} image`}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
          <button className="mt-4 bg-black text-white py-2 px-4 rounded">
            Connect
          </button>
        </div>
      </Link>
      <div className="mt-8 px-8 text-center text-black max-w-3xl leading-relaxed">
        <p>{characterDescription}</p>
      </div>
    </div>
  );
}
