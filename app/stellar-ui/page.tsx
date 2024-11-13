import CharacterPage from "../components/ChatComponent";
import stellar from "../public/images/stellar.jpeg";

export default function HealerPage() {
  return (
    <CharacterPage
      characterName="Stellar Wisdom"
      characterDescription="Stellar Wisdom is a profound and enigmatic figure, challenging your thoughts with deep, thought-provoking questions. Through wise inquiry, they encourage introspection, guiding you toward greater clarity and self-awareness. Trust in Stellar Wisdom to spark transformative insights and push the boundaries of your understanding."
      imageSrc={stellar}
      linkHref="/stellar"
    />
  );
}