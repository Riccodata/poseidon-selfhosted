export const SITE = {
  name: "Poseidon's Eden",
  url: "https://poseidonseden.com",
  email: "poseidonseden@gmail.com",
  phone: "+61 402 304 012",
  tagline: "Create your own underwater world.",
};

/**
 * The ten big categories (the owner's top-level menu), each with its own landing page.
 * `media` names the Higgsfield loop and still in /public/media.
 */
export const BIG_CATEGORIES: { handle: string; media: string; line: string }[] = [
  { handle: "corals", media: "corals", line: "SPS, LPS and soft corals for every kind of reef." },
  { handle: "marine-fish", media: "marine-fish", line: "Reef-safe favourites, beginner picks and showpiece fish." },
  { handle: "freshwater", media: "freshwater", line: "Community schools, cichlids, plecos and true monsters." },
  { handle: "plants", media: "plants", line: "Live plants for easy tanks and high-tech aquascapes." },
  { handle: "aquascaping-co2", media: "aquascaping-co2", line: "Hardscape, CO2, tools and substrates for planted tanks." },
  { handle: "equipment", media: "equipment", line: "Lighting, pumps, skimmers, controllers and more." },
  { handle: "accessories", media: "accessories", line: "Maintenance tools, filter media, rock and daily essentials." },
  { handle: "inverts", media: "inverts", line: "Clean-up crews, clams, anemones, shrimp and starfish." },
  { handle: "food-additives", media: "food-additives", line: "Fish food, coral food, live cultures and supplements." },
  { handle: "aquariums", media: "aquariums", line: "Complete systems from Waterbox, JBJ, Innovative Marine and more." },
];

export const STILL: Record<string, string> = {
  corals: "/media/stills/cat-corals.jpg",
  "marine-fish": "/media/stills/cat-marine-fish.jpg",
  freshwater: "/media/stills/cat-freshwater.jpg",
  plants: "/media/stills/cat-plants.jpg",
  "aquascaping-co2": "/media/stills/cat-aquascaping.jpg",
  equipment: "/media/stills/cat-equipment.jpg",
  accessories: "/media/stills/cat-accessories.jpg",
  inverts: "/media/stills/cat-inverts.jpg",
  "food-additives": "/media/stills/cat-food.jpg",
  aquariums: "/media/stills/cat-aquariums.jpg",
};

export const loopSrc = (media: string) => ({
  desktop: `/media/loops/${media}.mp4`,
  mobile: `/media/loops/${media}-m.mp4`,
  poster: `/media/loops/${media}.jpg`,
});

export const askHref = (subject: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

/** Lower-case a category name for use mid-sentence, keeping acronyms (LPS, SPS, CO2, AIO). */
export const lowerName = (name: string) =>
  name
    .split(" ")
    .map((w) => (/[A-Z].*[A-Z0-9]/.test(w) ? w : w.toLowerCase()))
    .join(" ");

/** The house brand is on every livestock listing; only real makers are worth printing. */
export const shownBrand = (brand: string | null) => (brand && brand !== "Poseidon's Eden" ? brand : null);
