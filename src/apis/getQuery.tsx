import { BASE_URL } from "./const";
import { Query } from "./types/Query";

/**
 * https://github.com/VOICEVOX/voicevox_engine
 * @param text
 * @param speaker styleId
 */
export async function getQuery(text: string, speaker: number): Promise<Query> {
  const resonse = await fetch(
    `${BASE_URL}/audio_query?text=${encodeURIComponent(
      text
    )}&speaker=${speaker}`,
    {
      headers: { accept: "application/json" },
      method: "POST",
      mode: "cors",
      credentials: "omit",
    }
  );
  return await resonse.json();
}
