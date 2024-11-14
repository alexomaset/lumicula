import CharacterPage from "../components/ChatComponent";
import Footer from "../footer/page";
import divine from "../public/images/divine.jpeg";

export default function HealerPage() {
  return (
    <>
    <CharacterPage
      characterName="Divine Pathways"
      characterDescription="Divine Pathways is a compassionate healer who guides individuals through the complex journey of love and relationships. With gentle wisdom and intuitive insight, she offers healing and clarity, helping people reconnect with their true selves and find harmony in their emotional connections."
      imageSrc={divine}
      linkHref="/divine-pathways"
    />
     <Footer />
    </>
  );
}