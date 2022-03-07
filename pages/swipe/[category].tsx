
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaHeart, FaStar, FaTimes } from "react-icons/fa";
import items from "../../app/items";
import SwipeCard from "../../app/swipeCard";
import { SwipeType, Target } from "../../app/types";
import { shuffle } from "../../app/utils";

import styles from "../../styles/Home.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(items).map((c) => ({ params: { category: c } })),
    fallback: false,
  };
};
export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const cat = params!.category as keyof typeof items;
  return {
    props: { items: items[cat] },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
};

const createTargetGenerator = (targets: Target[]) => {
  let cnt = 1;
  return () => {
    cnt++;
    return shuffle(targets.map((t) => ({ ...t, iter: cnt })));
  };
};

const SwipePage = ({
  items,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { category } = router.query;

  // Get random element from a list
  const [queue, setQueue] = useState<Target[]>([]);
  const [exitDirection, setExitDirection] = useState<SwipeType>("superlike");

  const generateTargets = useCallback(
    () => createTargetGenerator(items),
    [items]
  );

  useEffect(() => {
    if (!queue.length) {
      setQueue(generateTargets());
    }
  }, [queue, generateTargets]);

  const submitSwipe = (swipeType: SwipeType) => {
    setExitDirection(swipeType);
    setQueue((q) => q.slice(1));
  };

  return (
    <main className={styles.main}>
      <h1>
        Baljans Balla Badoo
      </h1>
      <SwipeCard
        target={queue.length ? queue[0] : null}
        exitDirection={exitDirection}
        submitSwipe={submitSwipe}
      />
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
  );
};

export default SwipePage;
