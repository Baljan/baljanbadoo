
export type SwipeType = "like" | "nope" | "superlike";

export type Target = {
  slug: string;
  category: string;
  image: string;
  name: string;
  iter?: number;
};