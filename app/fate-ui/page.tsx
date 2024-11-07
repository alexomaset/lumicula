import CharacterPage from "../components/ChatComponent";
import fate from "../public/images/fate.jpeg";

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Fate Whisperer"
      characterDescription="Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe..."
      imageSrc={fate}
      linkHref="/fate"
    />
  );
}