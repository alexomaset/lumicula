import CharacterPage from "../components/ChatComponent";
import comsic from "../public/images/comsic.jpeg" // Import specific image for each character

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Cosmic Horizons"
      characterDescription="Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe..."
      imageSrc={comsic}
      linkHref="/cosmic"
    />
  );
}
