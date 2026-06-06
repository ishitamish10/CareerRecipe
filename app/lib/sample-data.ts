import type { Roadmap } from "./types";

/**
 * Seed recipes used by the in-memory fallback store and by POST /api/seed.
 * Timestamps are fixed (not Date.now()) so the dataset is deterministic.
 */
export const SAMPLE_ROADMAPS: Roadmap[] = [
  {
    id: "seed-ai-engineer",
    title: "From CS Grad to AI Engineer at a FAANG in 4 Years",
    field: "Artificial Intelligence",
    duration: "4 years",
    description:
      "I started as a generic CS graduate with no ML background and slowly specialized into applied machine learning, eventually landing an AI Engineer role on a recommendations team.",
    successes:
      "Shipped two production ML models. Published a small paper at a workshop. Built a portfolio of 5 end-to-end ML projects that got recruiters' attention.",
    challenges:
      "The math was brutal at first — I almost quit during the linear algebra and probability grind. Imposter syndrome was real on a team of PhDs.",
    lessons:
      "Projects beat certificates. Reproduce papers instead of only watching tutorials. Learn the fundamentals deeply once, not many frameworks shallowly.",
    tips:
      "Pick one domain (NLP, vision, recsys) and go deep. Contribute to open source. Keep a public notebook of experiments.",
    createdAt: "2025-11-02T10:00:00.000Z",
    helpful: 142,
    commentsCount: 0,
  },
  {
    id: "seed-software-engineer",
    title: "Bootcamp to Senior Software Engineer Without a CS Degree",
    field: "Software Engineering",
    duration: "5 years",
    description:
      "I switched careers from marketing, did a 3-month bootcamp, and worked my way from junior to senior at a mid-size SaaS company.",
    successes:
      "Got my first dev job in 4 months. Led the migration of a monolith to services. Mentored 6 junior engineers who all got promoted.",
    challenges:
      "My first 6 months were terrifying — I had huge gaps in computer science fundamentals. I had to study data structures on nights and weekends.",
    lessons:
      "Communication is as important as code. Reading other people's code is the fastest way to grow. Say 'I don't know, I'll find out' confidently.",
    tips:
      "Build things people actually use. Learn to debug systematically. Get comfortable in the terminal and with git early.",
    createdAt: "2025-10-18T09:30:00.000Z",
    helpful: 208,
    commentsCount: 0,
  },
  {
    id: "seed-data-scientist",
    title: "Physics PhD to Data Scientist in Fintech",
    field: "Data Science",
    duration: "2 years (post-PhD transition)",
    description:
      "After my physics PhD I realized academia wasn't for me. I leveraged my stats and coding skills to break into data science at a fintech.",
    successes:
      "Translated research skills into business impact within 3 months. Built a fraud detection pipeline that saved real money.",
    challenges:
      "Learning to scope problems for a business instead of for a paper. SQL was a surprising gap. Stakeholder management was a whole new skill.",
    lessons:
      "Business context matters more than model accuracy. A simple model that ships beats a complex one that doesn't.",
    tips:
      "Master SQL. Learn to communicate to non-technical stakeholders. Do a Kaggle competition end to end.",
    createdAt: "2025-09-25T14:15:00.000Z",
    helpful: 97,
    commentsCount: 0,
  },
  {
    id: "seed-startup-founder",
    title: "Side Project to Funded Startup Founder",
    field: "Entrepreneurship",
    duration: "3 years",
    description:
      "What started as a weekend tool for my own problem turned into a venture-backed company after I found that thousands of people had the same pain.",
    successes:
      "Hit $10k MRR before raising. Closed a pre-seed round. Built a team of 8.",
    challenges:
      "Fundraising is a full-time job and full of rejection. Hiring the wrong first engineer set us back 6 months. Burnout nearly ended it.",
    lessons:
      "Talk to users before writing code. Distribution is harder than building. Protect your mental health — the company depends on it.",
    tips:
      "Charge money from day one. Ship embarrassingly early. Build in public to find your first users.",
    createdAt: "2025-08-30T11:45:00.000Z",
    helpful: 176,
    commentsCount: 0,
  },
];
