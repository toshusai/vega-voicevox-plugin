/**
 * https://github.com/VOICEVOX/voicevox_engine
 * @param text
 * @param speaker styleId
 */
export const getQuery = async (text: string, speaker: number) => {
  const resonse = await fetch(
    `http://localhost:50021/audio_query?text=${encodeURIComponent(
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
};
