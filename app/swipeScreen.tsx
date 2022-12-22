import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";
import { db } from "./db";
import { SwipeType, Target } from "./types";

import { Bar } from "react-chartjs-2";
import { FaHandPaper, FaHeart, FaStar, FaTimes } from "react-icons/fa";
import styles from "../styles/Home.module.css";
import { shuffle } from "./utils";

import items from "./items";
import SwipeCard from "./swipeCard";

import {
  BarElement, CategoryScale, Chart as ChartJS, LinearScale
} from "chart.js";

const SWIPE_LIMIT = 10;
const SWIPE_COOLDOWN_SECONDS = 60;
const SWIPE_COOLDOWN_LEEWAY = 10;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  // Title,
  // Tooltip,
  // Legend
);

const createTargetGenerator = (targets: Target[]) => {
  let cnt = 1;
  return () => {
    cnt++;
    return shuffle(targets.map((t) => ({ ...t, iter: cnt })));
  };
};

type Props = {
  category: string;
};

export default function SwipeScreen({ category }: Props) {
  // Get random element from a list
  const [queue, setQueue] = useState<Target[]>([]);
  const [exitDirection, setExitDirection] = useState<SwipeType>("superlike");

  const [cooldown, setCooldown] = useState(0);

  const swipes = useLiveQuery(() =>
    db.swipes.reverse().limit(SWIPE_LIMIT).toArray()
  );
  const swipesFull = useLiveQuery(() => db.swipes.toArray());

  useEffect(() => {
    // No need to set cooldown if limit has never been reached
    if (swipes === undefined || swipes.length < SWIPE_LIMIT) return;
    const lastTimestamp = swipes[swipes.length - 1].timestamp;
    const diffMs = new Date().getTime() - lastTimestamp.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    if (diffSeconds < SWIPE_COOLDOWN_SECONDS - SWIPE_COOLDOWN_LEEWAY)
      setCooldown(SWIPE_COOLDOWN_SECONDS - diffSeconds);
  }, [swipes]);

  useEffect(() => {
    if (cooldown > 0) {
      const timeout = setTimeout(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [cooldown]);

  const generateTargets = useCallback(
    () => createTargetGenerator(items[category]),
    [category]
  );

  useEffect(() => {
    if (!queue.length) {
      setQueue(generateTargets());
    }
  }, [queue, generateTargets]);

  const submitSwipe = async (swipeType: SwipeType) => {
    const item = queue[0].slug;
    setExitDirection(swipeType);
    setQueue((q) => q.slice(1));
    try {
      const id = await db.swipes.add({
        type: swipeType,
        target: item,
        category,
        timestamp: new Date(),
      });

      console.log(
        `Swipe ${swipeType} on ${item} successfully added. Got id ${id}`
      );
    } catch (error) {
      console.log(`Swipe ${swipeType} error`);
    }
  };

  // TEMP CHART CODE

  const options = {
    // plugins: {
    //   title: {
    //     display: true,
    //     text: "Chart.js Bar Chart - Stacked",
    //   },
      
    // },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
        y: {
          stacked: true,
        },
    },
  };

  const d = items[category].map((target) => {
    const item = target.slug;
    const relevantSwipes = swipesFull?.filter((swipe) => swipe.target === item);
    const cnt = relevantSwipes?.length ?? 1;
    const likes = relevantSwipes?.filter((swipe) => swipe.type === "like");
    const superlikes = relevantSwipes?.filter(
      (swipe) => swipe.type === "superlike"
    );
    const nopes = relevantSwipes?.filter((swipe) => swipe.type === "nope");
    return {
      superlike: (superlikes?.length ?? 0) / cnt,
      like: (likes?.length ?? 0) / cnt,
      nope: (nopes?.length ?? 0) / cnt,
    };
  });
  const data = {
    labels: items[category].map((t) => t.name),
    datasets: [
      {
        label: "Nope",
        data: d.map((d) => d.nope * -1),
        backgroundColor: "red",
      },
      {
        label: "Like",
        data: d.map((d) => d.like),
        backgroundColor: "green",
      },
      {
        label: "Superlike",
        data: d.map((d) => d.superlike * 2),
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <main className={styles.main}>
      <h1>Baljans Balla Badoo</h1>
      <SwipeCard
        disabled={cooldown > 0}
        target={queue.length ? queue[0] : null}
        exitDirection={exitDirection}
        submitSwipe={submitSwipe}
      />
      {cooldown > 0 ? (
        <div>
          <FaHandPaper />
          <p>Nu får det vara slutswipat på en stund! ({cooldown})</p>
        </div>
      ) : null}
      <div className={styles.buttonRow}>
        <button
          disabled={cooldown > 0}
          onClick={() => {
            submitSwipe("nope");
          }}
        >
          <FaTimes />
        </button>
        <button
          disabled={cooldown > 0}
          onClick={() => {
            submitSwipe("superlike");
          }}
        >
          <FaStar />
        </button>
        <button
          disabled={cooldown > 0}
          onClick={() => {
            submitSwipe("like");
          }}
        >
          <FaHeart />
        </button>
      </div>

      <Bar options={options} data={data} />
    </main>
  );
}
