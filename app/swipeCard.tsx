import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { SwipeType, Target } from "./types";
import styles from "./swipeCard.module.css";

const variants = {
  initial: {
    scale: 0,
    opacity: 0,
    translateX: 0,
    translateY: 0,
  },
  main: {
    scale: 1,
    opacity: 1,
    translateX: 0,
    translateY: 0,
  },
  exit: (d: SwipeType) => ({
    scale: 0.5,
    opacity: 1,
    translateX: d == "like" ? "150%" : d == "nope" ? "-150%" : 0,
    translateY: d == "superlike" ? "-100%" : 0,
    transition: {
      duration: 0.3,
    },
  }),
};

type Props = {
  target: Target | null,
  exitDirection: SwipeType,
  submitSwipe(swipeType: SwipeType): void 
}

export default function SwipeCard({target, exitDirection,submitSwipe}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useTransform(x, [-600, 0, 600], ["10deg", "0deg", "-10deg"]);
  const like = useTransform(x, [50, 250], [0, 1]);
  const superlike = useTransform(y, [-250, -50], [1, 0]);
  const nope = useTransform(x, [-250, -50], [1, 0]);

  return (
    <AnimatePresence exitBeforeEnter custom={exitDirection}>
      {target ? (
        <motion.div
          key={`${target.slug}-${target.iter}`}
          variants={variants}
          initial="initial"
          animate="main"
          exit="exit"
          className={styles.swipeCard}
          drag
          dragElastic={0.2}
          dragSnapToOrigin
          onDragEnd={(e, info) => {
            const {
              offset: { x, y },
            } = info;
            let swipeType: SwipeType | undefined;
            if (x > 200) {
              swipeType = "like";
            } else if (x < -200) {
              swipeType = "nope";
            } else if (y < -200) {
              swipeType = "superlike";
            }
            if (swipeType) {
              submitSwipe(swipeType);
            }
          }}
          style={{
            x,
            y,
            rotate: rotation,
          }}
        >
          <div className={styles.swipeCardImage}>
            <img src={target.image} />
          </div>
          <h2>{target.name}</h2>
          <motion.div
            className={`${styles.swipeHint} ${styles.swipeHintLike}`}
            style={{ opacity: like }}
          >
            Like
          </motion.div>
          <motion.div
            className={`${styles.swipeHint} ${styles.swipeHintNope}`}
            style={{ opacity: nope }}
          >
            Nope
          </motion.div>
          <motion.div
            className={`${styles.swipeHint} ${styles.swipeHintSuperlike}`}
            style={{ opacity: superlike }}
          >
            Superlike
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
