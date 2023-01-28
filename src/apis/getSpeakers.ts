interface Speacker {
  name: string;
  speaker_uuid: string;
  styles: Style[];
  version: string;
}

type Style = {
  id: number;
  name: string;
};

export async function getSpeakers(): Promise<Speacker[]> {
  const response = await fetch(`http://localhost:50021/speakers`);
  const speakers = await response.json();
  return speakers;
}
