"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface CharacterPlayerProps {
  pollenLevel: number;
  videoRef?: RefObject<HTMLVideoElement | null>;
  autoPlay?: boolean;
}

export default function CharacterPlayer({ pollenLevel, videoRef: externalRef, autoPlay = true }: CharacterPlayerProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const ref = externalRef ?? internalRef;
  const [currentLevel, setCurrentLevel] = useState(pollenLevel);

  useEffect(() => {
    if (pollenLevel !== currentLevel) {
      setCurrentLevel(pollenLevel);
    }
  }, [pollenLevel, currentLevel]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const src = `/assets/character/state-${currentLevel}.mp4`;
    if (video.src !== window.location.origin + src) {
      video.src = src;
      video.load();
      if (autoPlay) {
        const onCanPlay = () => {
          video.play().catch(() => {});
          video.removeEventListener("canplay", onCanPlay);
        };
        video.addEventListener("canplay", onCanPlay);
        return () => video.removeEventListener("canplay", onCanPlay);
      }
    }
  }, [currentLevel, autoPlay, ref]);

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: "65vh" }}>
      <div
        style={{
          position: "relative",
          width: "min(82vw, 440px)",
          aspectRatio: "1 / 1",
          borderRadius: "32px",
          overflow: "hidden",
          background: "linear-gradient(180deg, #f3e8d8, #ebe0d0)",
          boxShadow: "0 6px 24px rgba(160, 140, 110, 0.2), 0 0 0 1px rgba(255,255,255,0.3) inset",
        }}
      >
        <video
          ref={ref}
          loop
          muted
          playsInline
          style={{
            mixBlendMode: "multiply",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.06)",
          }}
          src={`/assets/character/state-${currentLevel}.mp4`}
        />
      </div>
    </div>
  );
}
