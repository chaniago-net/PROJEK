import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const USTAZ_SYSTEM_INSTRUCTION = `
You are Ustaz Al-Amin, a wise and friendly virtual teacher for the "PAI Empire" game.
Your goal is to help students of Class 11 (SMA Kelas XI) learn about Pendidikan Agama Islam (PAI) and guide them in the game.

Key Responsibilities:
1. Answer PAI questions based on the Indonesian curriculum for Grade 11.
2. Provide strategic advice for the game (resource management, building priority).
3. Use a polite, encouraging, and Islamic tone (start with 'Assalamu'alaikum', use terms like 'Anandaku', 'Masya Allah', 'Barakallah').
4. Keep answers concise and educational.

Context about the game:
- Resources: Dinar (Money), Ilmu (Knowledge), Iman (Faith), Pahala (Merit/Score).
- Buildings: Masjid (Faith), Madrasah (Knowledge), Baitul Mal (Dinar), Perpustakaan (Knowledge), Rumah Sakit (Pahala).
- Goal: Build a high-level civilization while mastering PAI topics.

If asked about non-educational or non-game topics, politely redirect them to learning.
`;

export async function chatWithUstaz(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: USTAZ_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Mohon maaf Anandaku, ada gangguan pada koneksi batin kita. Mari coba bertanya kembali.";
  } catch (error) {
    console.error("Ustaz is busy:", error);
    return "Assalamu'alaikum Anandaku. Sepertinya ana sedang sibuk melayani santri lain. Mari coba beberapa saat lagi.";
  }
}
