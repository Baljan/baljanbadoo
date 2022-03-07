import { Target } from "./types";

const items: Readonly<Record<string, Target[]>> = {
  klagg: [
    {
      slug: "delicatoboll",
      image: "/images/klagg/delicatoboll.jpg",
      name: "Delicatoboll",
    },
    {
      slug: "mazarin",
      image: "/images/klagg/mazarin.jpg",
      name: "Mazarin",
    },
  ],
  lask: [
    {
      slug: "champis",
      image: "/images/lask/champis.jpg",
      name: "Champis",
    },
    {
      slug: "cola",
      image: "/images/lask/cola.jpg",
      name: "Cola",
    },
    {
      slug: "colalight",
      image: "/images/lask/colalight.jpg",
      name: "Cola light",
    },
    {
      slug: "trocadero",
      image: "/images/lask/trocadero.jpg",
      name: "Trocadero",
    },
    {
      slug: "hallonsoda",
      image: "/images/lask/hallonsoda.jpg",
      name: "Hallonsoda",
    },
    {
      slug: "apelsin",
      image: "/images/lask/apelsin.jpg",
      name: "Apelsin",
    },
    {
      slug: "fruktsoda",
      image: "/images/lask/fruktsoda.jpg",
      name: "Fruktsoda",
    },
    {
      slug: "paronsoda",
      image: "/images/lask/paronsoda.jpg",
      name: "Päronsoda",
    },
    {
      slug: "sockerdricka",
      image: "/images/lask/sockerdricka.jpg",
      name: "Sockerdricka",
    },
    {
      slug: "lokaparon",
      image: "/images/lask/lokaparon.jpg",
      name: "Loka Päron",
    },
    {
      slug: "lokacitron",
      image: "/images/lask/lokacitron.jpg",
      name: "Loka Citron",
    },
    {
      slug: "lokanaturell",
      image: "/images/lask/lokanaturell.jpg",
      name: "Loka Naturell",
    },
  ],
};

export default items;
