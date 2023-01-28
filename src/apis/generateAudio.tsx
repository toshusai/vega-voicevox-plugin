import { BASE_URL } from "./const";
import { Query } from "./types/Query";

export const generateAudio = async (query: Query, speacker: number) => {
  const response = await fetch(`${BASE_URL}/synthesis?speaker=${speacker}`, {
    headers: {
      accept: "audio/wav",
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(query),
    mode: "cors",
  });
  return await response.blob();
};
