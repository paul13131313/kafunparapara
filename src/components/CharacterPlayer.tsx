"use client";

import { useEffect, useRef, useState } from "react";

interface CharacterPlayerProps {
  pollenLevel: number;
}

export default function CharacterPlayer({ pollenLevel }: CharacterPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLevel, setCurrentLevel] = useState(pollenLevel);

  useEffect(() => {
    if (pollenLevel !== currentLevel) {
      setCurrentLevel(pollenLevel);
    }
  }, [pollenLevel, currentLevel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `/assets/character/state-${currentLevel}.mp4`;
    if (video.src !== window.location.origin + src) {
      video.src = src;
      video.load();
      video.play().catch(() => {});
    }
  }, [currentLevel]);

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
          ref={videoRef}
          autoPlay
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
