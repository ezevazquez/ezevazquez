import type { Variants } from "framer-motion"

const easeOut = [0.22, 1, 0.36, 1] as const

export const motionEase = easeOut

export const microTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 24,
  mass: 0.55,
}

export const interactiveTransition = {
  type: "spring" as const,
  stiffness: 320,
  damping: 22,
  mass: 0.6,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
}

export const fadeUpSubtle: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
}

export const revealOnScroll = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export const viewportOnce = { once: true, amount: 0.15 as const }

export const sectionTransition = {
  duration: 0.7,
  ease: easeOut,
}

export const pathReveal: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
}

export const signalReveal: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: microTransition,
  },
}
