import CharacterPage from "../components/ChatComponent";
import comsic from "../public/images/comsic.jpeg" // Import specific image for each character

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Cosmic Horizons"
      characterDescription="Cosmic Horizons is a stellar guide who interprets the wisdom of the stars, offering clear direction to help you align with your dreams. With cosmic insights, they reveal the steps needed to manifest your deepest desires and unlock your true potential."
      imageSrc={comsic}
      linkHref="/cosmic"
    />
  );
}
