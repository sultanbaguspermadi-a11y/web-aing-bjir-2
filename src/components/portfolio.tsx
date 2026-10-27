"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { LanguageProvider, type FontProbe } from "./language-provider";
import { CursorProvider } from "./cursor-label";
import { Shell } from "./shell";

export function Portfolio({ arabicFonts }: { arabicFonts: FontProbe[] }) {
  return (
    <LanguageProvider arabicFonts={arabicFonts}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <CursorProvider>
            <Shell />
          </CursorProvider>
        </MotionConfig>
      </LazyMotion>
    </LanguageProvider>
  );
}
