import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const PHASES = ["Inhale", "Hold", "Exhale"];
const DURATIONS = {
  Inhale: 4000,
  Hold: 4000,
  Exhale: 4000
};

const PHASE_COLORS = {
  Inhale: "bg-green-400",
  Hold: "bg-yellow-400",
  Exhale: "bg-red-400"
};

const BreathingExercise = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (running) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const nextIndex = (phaseIndex + 1) % PHASES.length;
      setPhaseIndex(nextIndex);

      if (nextIndex === 0) {
        setCycles((c) => c + 1);
      }
    }, DURATIONS[phase]);

    return () => clearTimeout(timer);
  }, [phaseIndex, running]);

  useEffect(() => {
    if (running && cycles >= totalCycles) {
      setRunning(false);
    }
  }, [cycles, totalCycles, running]);

  const handleStart = () => {
    setPhaseIndex(0);
    setCycles(0);
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative w-60 h-60 flex items-center justify-center">
        <div
          className={`rounded-full ${PHASE_COLORS[phase]} transition-all ease-in-out`}
          style={{
            width: phase === "Inhale" ? "16rem" : phase === "Hold" ? "12rem" : "8rem",
            height: phase === "Inhale" ? "16rem" : phase === "Hold" ? "12rem" : "8rem",
            transitionDuration: `${DURATIONS[phase]}ms`
          }}
        ></div>
        <span className="absolute text-2xl font-semibold text-white drop-shadow-lg">
          {phase}
        </span>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleStart} disabled={running}>Start</Button>
        <Button onClick={handleStop} variant="outline">Stop</Button>
      </div>

      <p className="text-muted-foreground text-center">
        Follow the circle to regulate your breath
        <br />
        Cycle: {cycles}/{totalCycles}
      </p>

      <audio ref={audioRef} src="/audio/relaxing.mp3" loop preload="auto" />
    </div>
  );
};

export default BreathingExercise;
