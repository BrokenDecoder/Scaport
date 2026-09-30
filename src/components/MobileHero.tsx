"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./MobileHero.module.css";

export function MobileHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Keep the content readable on shorter phones before beginning the exit.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });
  // Match the original stagger over 65% of the viewport. Motion values
  // follow scrolling directly, so every element returns when scrolling up.
  const range = 0.65;
  const eyebrowY = useTransform(scrollYProgress, [0, range * 0.45], [0, -28]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0, range * 0.35], [1, 0]);
  const line1Y = useTransform(scrollYProgress, [0, range * 0.7], [0, -24]);
  const line1Opacity = useTransform(scrollYProgress, [range * 0.08, range * 0.65], [1, 0]);
  const line2Y = useTransform(scrollYProgress, [0, range * 0.78], [0, -18]);
  const line2Opacity = useTransform(scrollYProgress, [range * 0.15, range * 0.72], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, range * 0.55], [0, -36]);
  const portraitOpacity = useTransform(scrollYProgress, [0, range * 0.42], [1, 0]);
  const taglineY = useTransform(scrollYProgress, [0, range * 0.9], [0, -12]);
  const taglineX = useTransform(scrollYProgress, [0, range * 0.9], [0, -6]);
  const taglineOpacity = useTransform(scrollYProgress, [range * 0.25, range * 0.82], [1, 0]);
  const bodyY = useTransform(scrollYProgress, [0, range], [0, -8]);
  const bodyOpacity = useTransform(scrollYProgress, [range * 0.35, range], [1, 0]);

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="mobile-hero-name">
      <div className={styles.content}>
        <div>
          <motion.p
            className={styles.eyebrow}
            style={reduceMotion ? undefined : { y: eyebrowY, opacity: eyebrowOpacity }}
          >
            AI Engineer &amp; Builder
          </motion.p>
          <h1 id="mobile-hero-name" className={styles.name}>
            <motion.span style={reduceMotion ? undefined : { y: line1Y, opacity: line1Opacity }}>
              Himanshu
            </motion.span>
            <motion.span style={reduceMotion ? undefined : { y: line2Y, opacity: line2Opacity }}>
              Kushwaha
            </motion.span>
          </h1>
        </div>

        <motion.div
          className={styles.portrait}
          style={reduceMotion ? undefined : { y: portraitY, opacity: portraitOpacity }}
        >
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true" />
          <Image
            src="/images/himanshu-mobile.webp"
            alt="Himanshu Kushwaha"
            width={900}
            height={900}
            sizes="(max-width: 639px) 90vw, 440px"
            priority
            className={styles.image}
          />
        </motion.div>

        <div className={styles.intro}>
          <motion.p
            className={styles.tagline}
            style={reduceMotion ? undefined : { y: taglineY, x: taglineX, opacity: taglineOpacity }}
          >
            Intelligence,
            <span>thoughtfully built.</span>
          </motion.p>
          <motion.p
            className={styles.description}
            style={reduceMotion ? undefined : { y: bodyY, opacity: bodyOpacity }}
          >
            I build intelligent systems and high-performance software at the
            intersection of AI, physics, and design.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
