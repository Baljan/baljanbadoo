import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform
} from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaTimes } from "react-icons/fa";
import styles from "../styles/Home.module.css";

type SwipeType = "like" | "nope" | "superlike";

type Target = {
  id: string;
  image: string;
  name: string;
  iter?: number;
};

const targets: Target[] = [
  {
    id: "delicatoboll",
    image: "./images/klagg/delicatoboll.jpg",
    name: "Delicatoboll",
  },
  {
    id: "mazarin",
    image: "./images/klagg/mazarin.jpg",
    name: "Mazarin",
  },
];
function getRandomElement<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const createTargetGenerator = () => {
  let cnt = 1;
  return () => {
    cnt++;
    return shuffle(targets.map((t) => ({ ...t, iter: cnt })));
  };
};
const generateTargets = createTargetGenerator();


const Home: NextPage = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useTransform(x, [-600, 0, 600], ["10deg", "0deg", "-10deg"]);
  const like = useTransform(x, [50, 250], [0, 1]);
  const superlike = useTransform(y, [-250, -50], [1, 0]);
  const nope = useTransform(x, [-250, -50], [1, 0]);

  // Get random element from a list
  const [queue, setQueue] = useState<Target[]>([]);
  // const [showing, setShowing] = useState<boolean>(true);
  const [exitDirection, setExitDirection] = useState<SwipeType>("superlike");

  useEffect(() => {
    if (!queue.length) {
      setQueue(generateTargets());
    }
  }, [queue]);

  const submitSwipe = (swipeType: SwipeType) => {
    setExitDirection(swipeType);
    setQueue((q) => q.slice(1));
  };

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
        duration: 0.3
      }
    }),
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Baljanbadoo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>

      <main className={styles.main}>
        <AnimatePresence exitBeforeEnter custom={exitDirection}>
          {queue.length ? (
            <motion.div
              key={`${queue[0].id}-${queue[0].iter}`}
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
                <img src={queue[0].image} />
              </div>
              <h2>{queue[0].name}</h2>
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
        <div className={styles.buttonRow}>
          <button
            onClick={() => {
              submitSwipe("nope");
            }}
          >
            <FaTimes />
          </button>
          <button
            onClick={() => {
              submitSwipe("superlike");
            }}
          >
            <FaStar />
          </button>
          <button
            onClick={() => {
              submitSwipe("like");
            }}
          >
            <FaHeart />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
