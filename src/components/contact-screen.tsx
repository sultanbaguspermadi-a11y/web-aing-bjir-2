"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { m } from "framer-motion";
import { useLang } from "./language-provider";
import { ShardHeader } from "./shard-header";
import { GithubMark } from "./icons";
import { useListNav, useTickOnChange } from "@/lib/list-nav";
import { PROJECTS, SITE } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

interface Row {
  key: string;
  name: string;
  sub: string;
  href: string;
  accent: string;
  icon: ReactNode;
}

function host(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function ContactScreen() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  const rows: Row[] = [
    { key: "github", name: "GitHub", sub: `${t.contact.github} · ${host(SITE.github)}`, href: SITE.github, accent: "#7de6fd", icon: <GithubMark className="text-3xl" /> },
    ...PROJECTS.map((p) => ({
      key: p.id,
      name: p.title,
      sub: host(p.href),
      href: p.href,
      accent: p.accent,
      icon: <span className="ff-display text-2xl">{p.title.charAt(0)}</span>,
    })),
  ];

  useListNav(refs, rows.length, index);
  useTickOnChange(index);
  useEffect(() => {
    refs.current[0]?.focus({ preventScroll: true });
    // Focus the current item once, when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section aria-labelledby="contact-title" className="screen-in relative overflow-x-clip mx-auto min-h-dvh max-w-[1680px] px-(--gutter) pb-28 pt-20">
      <ShardHeader title={t.contact.title} id="contact-title" />

      {/* The "phone": a white frame behind a slanted dark body. */}
      <m.div
        className="relative max-w-[46rem]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3, ease: EASE_OUT }}
      >
        <div className="bg-white p-[3px]" style={{ clipPath: "polygon(0 5%,100% 0,100% 95%,0 100%)" }}>
          <div className="relative overflow-hidden bg-[#070a12] px-5 pb-8 pt-14 sm:px-8" style={{ clipPath: "polygon(0 5%,100% 0,100% 95%,0 100%)" }}>
            <span className="ghost start-4 top-1 text-[clamp(3.5rem,9vw,6rem)]" aria-hidden="true">
              {t.contact.title}
            </span>
            <ul className="relative m-0 flex list-none flex-col gap-3 p-0" aria-label={t.contact.title}>
              {rows.map((row, i) => (
                <li key={row.key}>
                  <a
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-active={index === i}
                    className="p3-item"
                    style={{ "--accent": row.accent } as CSSProperties}
                    onFocus={() => setIndex(i)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") refs.current[i]?.focus({ preventScroll: true });
                    }}
                  >
                    <span className="flex items-center gap-4 py-3 ps-3 pe-8">
                      <span className="grid size-14 shrink-0 place-items-center" style={{ background: row.accent, color: "#001233" }} aria-hidden="true">
                        {row.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[1.35rem] italic" lang="en" dir="ltr" style={{ fontFamily: "var(--font-kanit), sans-serif", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.1 }}>
                          {row.name}
                        </span>
                        <span aria-hidden="true" className="my-1 block h-px w-full bg-current opacity-30" />
                        <span className="ff-ui block truncate text-[0.9rem]" dir="ltr">
                          {row.sub}
                        </span>
                      </span>
                    </span>
                    <span className="sr-only"> {t.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </m.div>
    </section>
  );
}
