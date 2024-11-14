import CharacterPage from "../components/ChatComponent";
import Footer from "../footer/page";
import fate from "../public/images/fate.jpeg";

export default function HealerPage() {
  return (
    <>
    <CharacterPage
      characterName="Fate Whisperer"
      characterDescription="Fate Whisperer is a compassionate and gentle guide, offering soft-spoken wisdom to help you through your everyday challenges. With a soothing presence, he provides kind, intuitive insights that inspire confidence and clarity in life's uncertain moments."
      imageSrc={fate}
      linkHref="/fate"
    />
     <Footer />
    </>
  );
}