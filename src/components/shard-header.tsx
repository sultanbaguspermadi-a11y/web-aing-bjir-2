"use client";

import { m } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * "Shattered" banner title: sky band + midnight razor cut + cyan shards.
 * Shapes are clip-paths (mirrored with the page direction); the title text
 * itself is never skewed, so Arabic keeps its baseline and joins.
 */
export function ShardHeader({ title, id }: { title: string; id: string }) {
  return (
    <div className="shard-header">
      <div className="shard-shapes" aria-hidden="true">
        <m.span
          className="shard-back"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.05, ease: EASE_OUT }}
        />
        <m.span
          className="shard-main"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
        />
        <m.span
          className="shard-peak"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: EASE_OUT }}
        />
        <m.span
          className="shard-bit"
          style={{ width: "1.6rem", height: "0.9rem", insetInlineEnd: "0.4rem", bottom: "-1.1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        />
      </div>
      <m.h1
        id={id}
        className="ff-display shard-title"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
      >
        {title}
      </m.h1>
    </div>
  );
}
