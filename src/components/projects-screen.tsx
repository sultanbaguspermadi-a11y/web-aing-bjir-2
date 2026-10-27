"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, m, useMotionValue, useSpring } from "framer-motion";
import { useLang } from "./language-provider";
import { ShardHeader } from "./shard-header";
import { useCursorLabel } from "./cursor-label";
import { Arrow } from "./icons";
import { useListNav, useTickOnChange } from "@/lib/list-nav";
import { useFinePointer, useReducedMotionSafe } from "@/lib/use-media";
import { PROJECTS, type ProjectMeta } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

const RANK_NUMERAL: Record<ProjectMeta["id"], string> = { lughoti: "V", scrabble: "I" };

function ProjectFrame({ project, alt }: { project: ProjectMeta; alt: string }) {
  const { t } = useLang();
  const cursor = useCursorLabel();
  const fine = useFinePointer();
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLAnchorElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useSpring(rx, { stiffness: 120, damping: 20, mass: 0.6 });
  const my = useSpring(ry, { stiffness: 120, damping: 20, mass: 0.6 });

  return (
    <div className="relative" style={{ "--accent": project.accent } as CSSProperties}>
      {/* Offset accent plate behind the frame. */}
      <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rtl:-translate-x-3" style={{ background: project.accent, clipPath: "polygon(4% 0,100% 0,96% 100%,0 100%)" }} />
      <a
        ref={ref}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="group relative block overflow-hidden bg-n1"
        style={{ aspectRatio: project.aspect, clipPath: "polygon(4% 0,100% 0,96% 100%,0 100%)" }}
        onPointerEnter={(e) => {
          if (!fine) return;
          rect.current = ref.current?.getBoundingClientRect() ?? null;
          cursor.show(e.clientX, e.clientY, t.projects.cursor);
        }}
        onPointerMove={(e) => {
          const r = rect.current;
          if (!fine || reduced || !r) return;
          rx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
          ry.set(((e.clientY - r.top) / r.height - 0.5) * 12);
        }}
        onPointerLeave={() => {
          cursor.hide();
          rx.set(0);
          ry.set(0);
        }}
      >
        <m.div className="absolute -inset-[5%]" style={{ x: mx, y: my }}>
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Image src={project.image.src} alt={alt} fill sizes="(min-width: 1024px) 52vw, 94vw" className="object-cover" priority={project.id === "lughoti"} />
          </div>
        </m.div>
      </a>
    </div>
  );
}

export function ProjectsScreen() {
  const { t, lang, sign } = useLang();
  const [index, setIndex] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useListNav(refs, PROJECTS.length, index);
  useTickOnChange(index);
  useEffect(() => {
    refs.current[0]?.focus({ preventScroll: true });
    // Focus the current item once, when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const project = PROJECTS[index] ?? PROJECTS[0];
  const copy = t.projects[project.id];

  return (
    <section aria-labelledby="projects-title" className="screen-in relative overflow-x-clip mx-auto min-h-dvh max-w-[1680px] px-(--gutter) pb-28 pt-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <ShardHeader title={t.projects.title} id="projects-title" />
          <ul className="m-0 flex list-none flex-col gap-5 p-0" role="list">
            {PROJECTS.map((p, i) => {
              const c = t.projects[p.id];
              return (
                <m.li
                  key={p.id}
                  initial={{ opacity: 0, x: -70 * sign }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: EASE_OUT }}
                  style={{ marginInlineStart: `${i * 1.4}rem` }}
                >
                  <button
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    type="button"
                    data-active={index === i}
                    aria-current={index === i}
                    className="p3-item"
                    style={{ "--accent": p.accent } as CSSProperties}
                    onFocus={() => setIndex(i)}
                    onClick={() => setIndex(i)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") refs.current[i]?.focus({ preventScroll: true });
                    }}
                  >
                    <span className="flex items-center gap-4 py-4 ps-4 pe-10">
                      <span className="ff-display grid size-14 shrink-0 place-items-center text-2xl" style={{ background: p.accent, color: "#001233" }} aria-hidden="true">
                        {RANK_NUMERAL[p.id]}
                      </span>
                      <span className="min-w-0">
                        <span className="ff-annot block text-[0.8rem] opacity-80">{c.arcana.name}</span>
                        {/* Titles are proper names: always Latin, display face. */}
                        <span className="block text-[clamp(1.4rem,2.6vw,1.9rem)] italic" style={{ fontFamily: "var(--font-kanit), sans-serif", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05 }} lang="en" dir="ltr">
                          {p.title}
                        </span>
                        <span className="ff-ui mt-1 block text-[0.85rem] opacity-80">{c.category}</span>
                      </span>
                    </span>
                  </button>
                </m.li>
              );
            })}
          </ul>
        </div>

        <AnimatePresence mode="wait" initial>
          <m.article
            key={`${project.id}-${lang}`}
            aria-label={project.title}
            className="relative"
            initial={{ opacity: 0, x: 60 * sign }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * sign }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <ProjectFrame project={project} alt={copy.imageAlt} />
            <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <p className="ff-literary text-pretty text-[1.2rem] text-white">{copy.summary}</p>
              <dl className="grid grid-cols-3 gap-4 md:grid-cols-1">
                {(
                  [
                    [t.projects.labels.category, copy.category],
                    [t.projects.labels.platform, copy.platform],
                    [t.projects.labels.focus, copy.focus],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="ff-meta text-cyan">{label}</dt>
                    <dd className="ff-ui m-0 text-[0.95rem]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-8">
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="p3-btn">
                {t.projects.cta}
                <Arrow kind="ne" />
                <span className="sr-only"> {t.a11y.newTab}</span>
              </a>
            </div>
          </m.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
