import CharacterPage from "../components/ChatComponent";
import Footer from "../footer/page";
import ethereal from "../public/images/ethereal.jpeg";

export default function HealerPage() {
  return (
    <>
    <CharacterPage
      characterName="Ethereal Visions"
      characterDescription="Ethereal Visions is a wise, visionary guide who empowers users to recognize the impact of their actions and choices on their future. Through thoughtful, insightful conversations, this character helps users unlock their hidden potential and provides guidance on how to manifest their desired life. Ethereal Visions is both practical and reflective, blending inspiration with actionable advice to encourage growth and self-discovery."
      imageSrc={ethereal}
      linkHref="/etherial"
    />
     <Footer />
    </>
  );
}