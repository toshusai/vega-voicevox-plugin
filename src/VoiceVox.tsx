import React from "react";
import { generateAudio } from "./generateAudio";
import { getQuery } from "./getQuery";

export const VoiceVox = (props: any) => {
  const effect = props.scriptEffect;
  const { dispatch, actions } = props.appCtx;
  const textEffect = props.strip.effects.find((e: any) => e.type === "text");
  if (!effect) {
    return;
  }
  const [loading, setLoading] = React.useState(false);
  const handleClick = async (e: any) => {
    setLoading(true);
    const query = await getQuery(textEffect.text, effect.speaker ?? 4);
    const path = await generateAudio(query, effect.speaker ?? 4);
    const newAudioAsset = {
      id: Math.random().toString(36).substring(7),
      name: textEffect.text,
      type: "audio",
      path,
    };
    dispatch(actions.updateAssets(newAudioAsset));
    const newAudioStrip = {
      ...props.strip,
      id: Math.random().toString(36).substring(7),
      layer: props.strip.layer + 1,
      effects: [
        {
          id: Math.random().toString(36).substring(7),
          type: "audio",
          audioAssetId: newAudioAsset.id,
          volume: 1,
          offset: 0,
          keyframes: [],
        },
      ],
    };
    dispatch(actions.updateStrip(newAudioStrip));
    setLoading(false);
  };

  return (
    <div>
      <button disabled={loading} onClick={handleClick}>
        {loading ? "Loading..." : "Generate Audio"}
      </button>
    </div>
  );
};
