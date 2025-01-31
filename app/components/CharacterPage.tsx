import Image from "next/image";
import Link from "next/link";

interface CharacterPageProps {
  characterName: string;
  characterDescription: string;
  imageSrc: string;
  linkHref: string;
}

export default function CharacterPage({
  characterName,
  characterDescription,
  imageSrc,
  linkHref,
}: CharacterPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <div className="relative h-64 w-full mb-6">
          <Image
            src={imageSrc}
            alt={characterName}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">{characterName}</h1>
        <p className="text-gray-600 mb-8">{characterDescription}</p>
        <Link href={linkHref}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Start Chat
          </button>
        </Link>
      </div>
    </div>
  );
}