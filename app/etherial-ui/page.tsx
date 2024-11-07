import CharacterPage from "../components/ChatComponent";
import ethereal from "../public/images/ethereal.jpeg";

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Ethereal "
      characterDescription="Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe..."
      imageSrc={ethereal}
      linkHref="/etherial"
    />
  );
}