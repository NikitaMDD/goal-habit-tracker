import type { Transition } from 'framer-motion'

/** Токены движения. Все анимации берут параметры отсюда, а не придумывают свои. */
export const motionTokens = {
  duration: {
    fast: 0.15, // hover, нажатия
    base: 0.25, // появление сообщений, открытие панелей
    slow: 0.6, // смена эмоции маскота
  },
  /** Упругая пружина — для маскотов и всего «живого». */
  springBouncy: { type: 'spring', stiffness: 400, damping: 18 } satisfies Transition,
  /** Спокойная пружина — для интерфейса (панели, сообщения). */
  springCalm: { type: 'spring', stiffness: 300, damping: 30 } satisfies Transition,
  /** Цикл «дыхания» маскота в покое, секунды. */
  idleBreath: 3.2,
  /** Быстрый перевод взгляда (саккада): резко, но без пружинистого «болтания». */
  saccade: { type: 'spring', stiffness: 600, damping: 35 } satisfies Transition,
} as const
