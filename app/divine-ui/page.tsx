import CharacterPage from "../components/ChatComponent";
import divine from "../public/images/divine.jpeg";

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Divine Pathways"
      characterDescription="Fate Whisperer is a compassionate and gentle guide, offering soft-spoken wisdom to help you through your everyday challenges. With a soothing presence, he provides kind, intuitive insights that inspire confidence and clarity in life's uncertain moments."
      imageSrc={divine}
      linkHref="/divine-pathways"
    />
  );
}