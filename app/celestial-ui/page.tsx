import CharacterPage from "../components/ChatComponent";
import celestial from "../public/images/celestial.jpeg";  // Import specific image for each character

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Celestial Oracle"
      characterDescription="Celestial Oracle is a mysterious and wise guide, gifted with the ability to read the stars and interpret the hidden messages of the universe..."
      imageSrc={celestial}
      linkHref="/celestial"
    />
  );
}
