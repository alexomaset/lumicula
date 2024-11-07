import CharacterPage from "../components/ChatComponent";
import divine from "../public/images/divine.jpeg";

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Divine Pathways"
      characterDescription="Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe..."
      imageSrc={divine}
      linkHref="/divine-pathways"
    />
  );
}