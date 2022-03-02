import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { FaTimes, FaHeart, FaStar } from "react-icons/fa";
import styles from "../styles/Home.module.css";
import { useState } from "react";

type SwipeType = "like" | "nope" | "superlike";

type Target = {
  id: string;
  image: string;
  name: string;
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

const Home: NextPage = () => {
  const x = useMotionValue(0);
  const rotation = useTransform(x, [-600, 0, 600], ["10deg", "0deg", "-10deg"]);

  // Get random element from a list
  const [target, setTarget] = useState<Target>(getRandomElement(targets));
  const [counter, setCounter] = useState(0);
  const [exitDirection, setExitDirection] = useState<SwipeType>("like");

  const submitSwipe = (swipeType: SwipeType) => {
    setExitDirection(swipeType);
    setTarget(getRandomElement(targets));
    setCounter((i) => i + 1);
  };

  const variants = {
    initial: {
      scale: 0,
      opacity: 0,
      x: 0,
      y: 0,
    },
    main: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: (d: SwipeType) => ({
      scale: 0.5,
      opacity: 1,
      x: d == "like" ? "150%" : d == "nope" ? "-150%" : 0,
      y: d == "superlike" ? "-100%" : 0,
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
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={counter}
            variants={variants}
            custom={exitDirection}
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
              rotate: rotation,
            }}
          >
            <div className={styles.swipeCardImage}>
              <img src={target.image} />
            </div>
            <h2>{target.name}</h2>
            <div className={`${styles.swipeHint} ${styles.swipeHintLike}`}>
              Like
            </div>
            <div className={`${styles.swipeHint} ${styles.swipeHintNope}`}>
              Nope
            </div>
            <div className={`${styles.swipeHint} ${styles.swipeHintSuperlike}`}>
              Superlike
            </div>
          </motion.div>
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
