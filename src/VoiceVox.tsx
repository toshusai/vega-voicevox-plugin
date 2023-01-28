import React from "react";
import { generateAudio } from "./apis/generateAudio";
import { getQuery } from "./apis/getQuery";
import { Effect, isAudioEffect } from "types";
import { uuid } from "short-uuid";
import { getSpeakers } from "./apis/getSpeakers";

type VoiceVoxEffect = Effect & {
  speaker: number;
  speedScale: number;
  text: string;
};

export const VoiceVox = (props: any) => {
  const effect: VoiceVoxEffect = props.scriptEffect;
  const { dispatch, actions } = props.appCtx;
  const audioEffect = props.strip.effects.find((e: Effect) => isAudioEffect);
  if (!audioEffect) {
    return;
  }
  if (!effect) {
    return;
  }
  const [loading, setLoading] = React.useState(false);

  const [text, setText] = React.useState(effect.text);
  const [speaker, setSpeaker] = React.useState(effect.speaker ?? 4);

  const handleClick = async (e: any) => {
    setLoading(true);
    const query = await getQuery(text, speaker);
    const blob = await generateAudio(
      {
        ...query,
        speedScale: speed,
      },
      speaker
    );
    const buffer = await blob.arrayBuffer();
    const path = `file:///tmp/${uuid()}.wav`;
    await props.appCtx.fs.writeFile(path, new Uint8Array(buffer));
    const newAudioAsset = {
      id: uuid(),
      type: "audio",
      name: text,
      path,
    };

    dispatch(actions.updateAssets(newAudioAsset));
    const newAudioStrip = {
      ...props.strip,
      effects: props.strip.effects.map((e: Effect) => {
        if (isAudioEffect(e) && e.id === audioEffect.id) {
          return {
            ...e,
            audioAssetId: newAudioAsset.id,
          };
        }
        if (e.id === effect.id) {
          return {
            ...e,
            speaker: effect.speaker,
            speedScale: speed,
            text,
          };
        }
        return e;
      }),
    };
    dispatch(actions.updateStrip(newAudioStrip));
    setLoading(false);
  };

  const [speed, setSpeed] = React.useState(effect.speedScale);

  const [speakerOptions, setSpeakerOptions] = React.useState([]);

  React.useEffect(() => {
    if (speakerOptions.length > 0) return;
    getSpeakers().then((speakers) => {
      let items: any[] = [];
      speakers.forEach((speaker) => {
        speaker.styles.forEach((style) => {
          items.push({
            value: style.id,
            label: `${speaker.name} - ${style.name}`,
          });
        });
      });
      setSpeakerOptions(items);
    });
  }, []);

  return (
    <div>
      <select
        value={speaker}
        onChange={(e) => setSpeaker(parseInt(e.target.value))}
      >
        {speakerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <input
          type="range"
          min="0.5"
          max="2"
          step={0.01}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
        {speed}
      </div>
      <div>
        <button disabled={loading} onClick={handleClick}>
          {loading ? "Loading..." : "Generate Audio"}
        </button>
      </div>
    </div>
  );
};
