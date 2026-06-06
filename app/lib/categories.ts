export interface Category {
  slug: string;
  name: string;
  emoji: string;
  image: string;
  blurb: string;
  /** Tailwind gradient classes used for the category accent. */
  accent: string;
}

/**
 * The headline career fields surfaced on the home page and explorer.
 * Images live in /public/images (copied from the original project).
 */
export const CATEGORIES: Category[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    emoji: "🧠",
    image: "/images/ai.jpg",
    blurb: "Build intelligent systems — from ML fundamentals to deep learning.",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    slug: "software-engineering",
    name: "Software Engineering",
    emoji: "💻",
    image: "/images/software-engineering.jpg",
    blurb: "Design, ship, and scale software that millions rely on.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    slug: "data-science",
    name: "Data Science",
    emoji: "📊",
    image: "/images/data-science.jpg",
    blurb: "Turn raw data into decisions, models, and insight.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    emoji: "🔐",
    image: "/images/cybersecurity.jpg",
    blurb: "Defend systems, hunt threats, and secure the digital world.",
    accent: "from-rose-500 to-red-500",
  },
  {
    slug: "robotics",
    name: "Robotics",
    emoji: "🤖",
    image: "/images/robotics.jpg",
    blurb: "Where hardware meets code to build machines that act.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    slug: "medicine",
    name: "Medicine",
    emoji: "🏥",
    image: "/images/medicine.jpg",
    blurb: "The long road from pre-med to practicing professional.",
    accent: "from-pink-500 to-rose-500",
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    emoji: "🚀",
    image: "/images/entrepreneurship.jpg",
    blurb: "From idea to MVP to a company that scales.",
    accent: "from-orange-500 to-amber-500",
  },
];

export function categoryForField(field: string): Category | undefined {
  const f = field.toLowerCase();
  return CATEGORIES.find(
    (c) => c.name.toLowerCase() === f || c.slug === f || f.includes(c.slug.replace(/-/g, " ")),
  );
}
