import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType
} from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import items from "../../app/items";

// Import dynamically to stop server side rendering of the actual app,
// head tags are still server side rendered.
const SwipeScreen = dynamic(
  () => import("../../app/swipeScreen"),
  {
    ssr: false,
  }
);

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

const SwipePage = ({
  items,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { category: categoryQuery } = router.query;
  const category = Array.isArray(categoryQuery)
    ? categoryQuery[0]
    : categoryQuery!;

  return (
    <SwipeScreen category={category} />
  );
};

export default SwipePage;
