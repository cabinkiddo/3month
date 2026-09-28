import { useEffect, useRef, useState } from "react";

/** Visitors start the quiet ambient soundtrack with an explicit click. */
export function AmbientSound({ src = "/data-edge-ambient.mp3" }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const track = audio.current;
    if (track && sessionStorage.getItem("data-edge-sound-enabled") === "true") {
      track.volume = 0.38;
      track.play().then(() => { setPlaying(true); setError(false); }).catch(() => {
        // Some browsers require a fresh tap after a full page navigation.
        setPlaying(false);
      });
    }
    const onVisibility = () => {
      if (document.hidden && audio.current) {
        audio.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const toggle = async () => {
    const track = audio.current;
    if (!track) return;
    if (playing) {
      track.pause();
      setPlaying(false);
      sessionStorage.setItem("data-edge-sound-enabled", "false");
      return;
    }
    try {
      track.volume = 0.38;
      await track.play();
      setPlaying(true);
      setError(false);
      sessionStorage.setItem("data-edge-sound-enabled", "true");
    } catch {
      setPlaying(false);
      setError(true);
    }
  };

  return (
    <>
      <audio ref={audio} src={src} loop preload="auto" onError={() => setError(true)} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute ambient music" : "Play ambient music"}
        aria-pressed={playing}
        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-3 text-xs text-foreground backdrop-blur-md transition-colors hover:border-signal hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal md:right-8 md:bottom-8"
      >
        <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
          {[5, 10, 7, 12].map((height, index) => (
            <span key={index} className={`w-[2px] rounded-full bg-current ${playing ? "animate-pulse" : "opacity-50"}`} style={{ height }} />
          ))}
        </span>
        <span className="data uppercase tracking-[0.12em]">{error ? "Sound unavailable" : playing ? "Sound on" : "Play sound"}</span>
      </button>
    </>
  );
}
