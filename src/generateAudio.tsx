export const generateAudio = async (query: any, speacker: number) => {
  const response = await fetch(
    `http://localhost:50021/synthesis?speaker=${speacker}`,
    {
      headers: {
        accept: "audio/wav",
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(query),
      mode: "cors",
    }
  );
  return URL.createObjectURL(await response.blob());
};
