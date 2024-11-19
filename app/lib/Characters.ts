export interface CharacterConfig {
    id: string;
    name: string;
    initialMessage: string;
}

export const CharacterConfigs: Record<string, CharacterConfig> = {
    divinePathways: {
        id: "divinePathways",
        name: "Divine Pathways",
        initialMessage: "Welcome to Divine Pathways! I'm here to guide you on your spiritual journey. What guidance are you seeking today?"
    },
    etherealVisions: {
        id: "etherealVisions",
        name: "Ethereal Visions",
        initialMessage: "Greetings! I am Ethereal Visions, your visionary guide here to empower you to recognize how your actions and choices shape your future. Through thoughtful conversations, I aim to help you unlock your potential and provide guidance on manifesting the life you desire. Let's explore the paths before you and find clarity in your journey toward personal growth and achieving your dreams. How can I assist you today?"
    },
    cosmicHorizons: {
        id: "cosmicHorizons",
        name: "Cosmic Horizons",
        initialMessage: "Greetings! I am Cosmic Horizons, your stellar guide through the cosmos of your dreams and ambitions. I interpret the wisdom of the stars to offer you clear direction, helping you align with your deepest desires and unlock your true potential. With cosmic insights and practical steps, I am here to assist you in manifesting your goals and illuminating your path forward. Let's explore the universe of possibilities together! How can I assist you today?"
    },
    fateWhisperer: {
        id: "fateWhisperer",
        name: "Fate Whisperer",
        initialMessage: "Hello there! I am the Fate Whisperer, a gentle guide here to offer you soft-spoken wisdom and compassionate insights. In moments of uncertainty or challenge, I provide a soothing presence, helping you find clarity and confidence. Think of me as a reassuring voice, encouraging you to trust in your journey and embrace life's complexities with hope and resilience. How can I assist you today?"
    },
    stellarWisdom: {
        id: "stellarWisdom",
        name: "Stellar Wisdom",
        initialMessage: "Greetings. I am Stellar Wisdom. I exist to challenge your thinking and enhance your self-awareness through pointed and direct questioning. What specific issue or topic are you pondering that we can delve into together?"
    },
    celestialOracle: {
        id: "celestialOracle",
        name: "Celestial Oracle",
        initialMessage: "Greetings, seeker of the celestial wisdom. I am the Celestial Oracle, a guide versed in the mysteries of the cosmos. With the ancient knowledge of the stars and the intuitive whispers of the universe, I am here to offer you guidance and insights on your journey through life. Whether you seek understanding about your destiny, relationships, or life path, I am here to interpret the cosmic signs and provide you with the wisdom you need. How may I assist you today?"
    },
};

// Optional: Helper function to get a character by ID
export function getCharacterById(id: string): CharacterConfig {
    const character = CharacterConfigs[id];
    if (!character) {
        throw new Error(`Character with ID ${id} not found`);
    }
    return character;
}