/* =====================================================================
   All site content lives here. Edit this file to update the page.
   ===================================================================== */

const PROFILE = {
  name: "Sanjana",
  photo: "img/sanjana.jpg",
  heading: "Software engineer who builds for people.",
  about: "I'm at my best in product-facing roles, where understanding the user is just as important as writing the code. I work across the stack, from React frontends to backend pipelines to ML systems, and I own what I build all the way to production. For me, good engineering is software people actually want to use.",
  status: "Open to full-time roles starting January 2027",
  location: "Boston, MA",
  email: "sanjanasanjeev118@gmail.com",
  linkedin: "https://www.linkedin.com/in/sanjana-sanjeev-kumar/",
  github: "https://github.com/Sanjask",
  resume: "resume.pdf", // TODO: add resume.pdf to the repo root
  roles: ["Software Engineer", "Product Engineer", "ML Engineer"],
};

/* Two experience groups, each shown as a dropdown */
const EXPERIENCE = [
  {
    id: "engineering",
    title: "Engineering",
    blurb: "Shipping products, infrastructure and LLM systems",
    open: false,
    roles: [
      {
        org: "BU Spark!", logo: "img/logos/bu-spark.png", role: "Software Engineer", when: "Sep 2026 to Present", where: "Boston, US", mark: "#ffd6e0",
        points: [
          "Built a React Native and Supabase emergency app for BU Campus Planning and Operations, working directly with the client and UX team to cut the path to the right safety instructions from 6 clicks to 2.",
          "Implemented geofencing-based location detection to show nearby emergencies and the closest of 122 campus AEDs, falling back to the last known position after a 10 second GPS timeout.",
          "Set up a GitHub Actions CI/CD pipeline that runs linting, type checks and unit tests on every build, plus Husky pre-commit hooks for local checks.",
        ],
        stack: ["React Native", "Expo", "Supabase", "PostgreSQL", "GitHub Actions"],
      },
      {
        org: "NVIDIA x SIT AI Center", logo: "img/logos/nvidia.svg", role: "Software Engineer Intern, AI Agents", when: "Jun 2026 to Aug 2026", where: "Remote", mark: "#d7f5e6",
        points: [
          "Engineered a KV cache reuse and fusion pipeline for concurrent multi-agent LLM serving that recomputes under 15% of token KV states and overlaps GPU cache loading with recomputation to hide latency.",
          "Designed an adaptive controller that sets per-request recompute ratios from KV divergence signals, cutting time to first token 4× from 565ms to 143ms and raising throughput 2.8 to 5× with no quality loss.",
          "Built a reproducible evaluation harness with per-example logging and bootstrap confidence intervals across repeated trials, which surfaced a silent bug and reshaped which configurations we tested next.",
        ],
        stack: ["Python", "PyTorch", "LLM serving", "GPU"],
      },
      {
        org: "National University of Singapore", logo: "img/logos/nus.png", role: "Software Engineer Intern", when: "Dec 2024 to May 2025", where: "Singapore", mark: "#d8e9ff",
        points: [
          "Worked on an autonomous LLM agent for code repair that pairs GPT-4 with AST code search and iterative context retrieval, cutting LLM cost per task by 83% from $2.51 to $0.43.",
          "Engineered prompt pipelines that feed spectrum-based fault localization signals into the LLM context, raising the issue resolution rate to 19% on SWE-bench Lite and outperforming SWE-agent.",
          "Optimized LLM inference workflows across 2.2k real-world GitHub issues with context pruning and pipeline automation, reducing end-to-end repair time by 77%.",
        ],
        stack: ["Python", "GPT-4", "LLM agents"],
      },
      {
        org: "Al-Muftah Group", logo: "img/logos/al-muftah.png", role: "Software Development Intern", when: "May 2024 to Jun 2024", where: "Doha, Qatar", mark: "#fff1b8",
        points: [
          "Delivered a full-stack sales analytics dashboard over 90K+ sales records across 20+ product categories, building the interface and data layer with React, SQL and REST APIs.",
          "Automated weekly sales reporting with backend data pipelines and optimized SQL queries, cutting manual reporting effort by 30%.",
        ],
        stack: ["React", "SQL", "REST APIs"],
      },
      {
        org: "Avanceon", logo: "img/logos/avanceon.png", role: "Software Engineering Intern", when: "Dec 2023 to Jan 2024", where: "Doha, Qatar", mark: "#ece6ff",
        points: [
          "Built Python and SQL data processing for Qatar Metro signal data.", // TODO: add more detail
        ],
        stack: ["Python", "SQL"],
      },
    ],
  },
  {
    id: "research",
    title: "Research & Teaching",
    blurb: "Multimodal ML research and teaching CV, HCI and calculus",
    open: false,
    roles: [
      {
        org: "Image & Video Computing Group, Boston University", logo: "https://www.google.com/s2/favicons?domain=bu.edu&sz=128", role: "Machine Learning Researcher", when: "Aug 2026 to Present", where: "Boston, US", mark: "#ffe0cc",
        points: [
          "Investigating whether omnimodal LLMs can imagine audio cues from visual context to improve audio-visual spatial reasoning when models ignore or hallucinate a modality.",
          "Created an evaluation pipeline on the SpatialSceneQA benchmark across 100 scenes and 5 task types that synthesizes spatial audio from room impulse responses and benchmarks Qwen3-Omni.",
        ],
        stack: ["PyTorch", "Qwen3-Omni", "Audio-visual LLMs"],
      },
      {
        org: "Boston University", logo: "https://www.google.com/s2/favicons?domain=bu.edu&sz=128", role: "Graduate Teaching Assistant, Computer Vision", when: "Current", where: "Boston, US", mark: "#ffd6e0",
        points: ["TA for the graduate Computer Vision course."],
        stack: [],
      },
      {
        org: "MIDAS Lab, IIIT Delhi", logo: "https://www.google.com/s2/favicons?domain=iiitd.ac.in&sz=128", role: "Research Assistant", when: "Aug 2023 to Jun 2025", where: "Delhi, India", mark: "#d7f5e6",
        points: [
          "Implemented an automated caption-injection fine-tuning pipeline that generates image captions and feeds them alongside questions during LoRA training across LLaVA and InternVL at 7B to 13B scales.",
          "Extended the approach to a low-resource language by validating it on a 2,245-sample Hindi physics visual QA benchmark spanning 5 reasoning types.",
          "Improved accuracy by up to 8% on ScienceQA and nearly 15% for the smallest model on the Hindi benchmark, with the largest gains on weaker vision encoders.",
        ],
        stack: ["PyTorch", "LoRA", "LLaVA", "InternVL"],
      },
      {
        org: "IIIT Delhi", logo: "https://www.google.com/s2/favicons?domain=iiitd.ac.in&sz=128", role: "Teaching Assistant, Multivariate Calculus", when: "Jan 2024 to May 2024", where: "Delhi, India", mark: "#fff1b8",
        points: ["TA for the undergraduate Multivariate Calculus course."],
        stack: [],
      },
      {
        org: "IIIT Delhi", logo: "https://www.google.com/s2/favicons?domain=iiitd.ac.in&sz=128", role: "Teaching Assistant, Human-Computer Interaction", when: "Sep 2023 to Dec 2023", where: "Delhi, India", mark: "#d8e9ff",
        points: ["TA for the undergraduate Human-Computer Interaction course."],
        stack: [],
      },
    ],
  },
];

/* Projects board. cover drives the drawn card art; set img to use a screenshot instead. */
const PROJECTS = [
  {
    id: "notify", title: "Notify", sub: "Real-time collaborative notes",
    cats: ["product", "swe"], when: "May 2026 to Jun 2026", h: 250,
    cover: { type: "editor", bg: "#d8e9ff" },
    problem: "Shared docs break when two people edit the same spot at once.",
    built: ["React and TypeScript editor synced over WebSockets with Yjs CRDTs.", "PostgreSQL persistence layer.", "Google OAuth 2.0 and JWT sessions securing both the REST endpoints and WebSocket connections."],
    impact: "Multi-user edits sync across clients in under a second.",
    stack: ["React", "TypeScript", "Node.js", "WebSockets", "Yjs", "PostgreSQL", "OAuth 2.0"],
    links: [["GitHub repo", "https://github.com/Sanjask/Notify-Doc"]],
  },
  {
    id: "holostream", title: "Event-driven LLM agent in HoloStream", sub: "Go · distributed stream processing",
    cats: ["swe", "ml"], when: "Sep 2026 to Present", h: 240,
    cover: { type: "terminal", bg: "#20232a", lines: ["on alert(incident):", "  ctx  = telemetry.fetch()", "  plan = agent.react(ctx)", "  root = plan.root_cause()"] },
    problem: "Production alerts pile up faster than people can diagnose them.",
    built: ["LLM agent operator inside HoloStream, a distributed stream processor in Go, running a ReAct loop with tool calls to find each alert's root cause.", "Async scheduler with a concurrency limit and per-service ordering.", "Per-key memory of past diagnoses plus timeouts that keep the stream running across multiple CloudLab nodes."],
    impact: "In progress.",
    stack: ["Go", "Python", "LLM agents", "CloudLab"],
    links: [],
  },
  {
    id: "vlm-rotation", title: "Teaching VLMs to recognize rotation", sub: "52% to 91% accuracy",
    cats: ["ml"], when: "May 2026 to Aug 2026", h: 300,
    cover: { type: "metric", bg: "#fff1b8", value: "91%", label: "rotation accuracy, up from chance", spark: [5, 5.2, 5.1, 6, 7.2, 8.1, 8.8, 9.1] },
    problem: "Vision-language models fail at rotation, even though their vision encoders keep that information.",
    built: ["Identified the language decoder as the bottleneck.", "Fine-tuned only the decoder with QLoRA while keeping the vision encoder frozen."],
    impact: "Rotation recognition went from chance at 52% to 91%, and the approach generalized across three models at 91 to 98% with no catastrophic forgetting on general benchmarks.",
    stack: ["PyTorch", "QLoRA", "Qwen2.5-VL"],
    links: [],
  },
  {
    id: "credit-risk", title: "Credit risk detection", sub: "0.93 ROC-AUC on loan defaults",
    cats: ["ml"], when: "Feb 2026 to May 2026", h: 230,
    cover: { type: "metric", bg: "#ffe0cc", value: "0.93", label: "ROC-AUC with XGBoost", spark: [3, 4, 5, 6.5, 7.5, 8.4, 9, 9.3] },
    problem: "Defaults are rare, so a naive model learns that everyone pays back and still looks accurate.",
    built: ["End-to-end pipeline for cleaning, feature engineering and evaluation.", "Benchmarked XGBoost against logistic regression, decision trees and random forests.", "Probability-based threshold tuning to catch more defaulters, with Pytest tests across the pipeline."],
    impact: "0.93 ROC-AUC.",
    stack: ["Python", "XGBoost", "scikit-learn", "Pytest"],
    links: [["GitHub repo", "https://github.com/DaneshBU/CS506-Project"]],
  },
  {
    id: "storify", title: "Storify", sub: "Music that matches your mood",
    cats: ["product", "ml"], when: "IIIT Delhi", h: 320,
    cover: { type: "player", bg: "#e4dbff" },
    problem: "Music apps don't know how you feel right now.",
    built: ["CNN emotion models in PyTorch.", "React frontend with a Flask API.", "Recommendations through the Spotify API, deployed with Docker."],
    impact: "Mood in, playlist out.",
    stack: ["React", "Flask", "PyTorch", "Spotify API", "Docker"],
    links: [["GitHub repo", "https://github.com/Sanjask/Storify"]],
  },
  {
    id: "echoweather", title: "EchoWeather", sub: "Android weather app in Kotlin",
    cats: ["product", "swe"], when: "Mobile Computing project", h: 300,
    cover: { type: "weather", bg: "#bfe0ff" },
    problem: "Most weather apps tell you today's forecast but not how today compares to the past. I wanted one app for live weather, any city in the world and long-term temperature trends.",
    built: [
      "Home screen that finds your location with Google's FusedLocationProvider, handles runtime permissions and shows current, min and max temperature with day or night icons.",
      "Search screen that turns any city or country into coordinates with Geocoder, validates input before calling the API and reuses the same API layer across screens.",
      "History screen that pulls 10 years of temperatures, plots the trend with MPAndroidChart and compares today against the historical average with percentage change.",
      "Networking with OkHttp, JSON parsing with Gson, Room for local storage and Open-Meteo as the data source.",
    ],
    impact: "Live weather, global search and a decade of climate trends in one Android app.",
    stack: ["Kotlin", "Android", "OkHttp", "Gson", "Room", "MPAndroidChart", "REST APIs"],
    links: [["GitHub repo", "https://github.com/Sanjask/WeatherApp"]],
  },
  {
    // TODO: double-check this description
    id: "legends-of-valor", title: "Legends of Valor", sub: "Turn-based strategy game in Java",
    cats: ["swe"], when: "", h: 260,
    cover: { type: "game", bg: "#ffe0cc" },
    problem: "A turn-based board game where a party of heroes fights its way through lanes of monsters to reach the enemy base.",
    built: ["Designed the game with object-oriented patterns so heroes, monsters, items and board tiles stay easy to extend.", "Built the turn loop, combat, inventory and market logic, playable from the terminal."],
    impact: "",
    stack: ["Java", "OOP", "Design patterns"],
    links: [["GitHub repo", "https://github.com/Sanjask/LegendsOfValorFinalProject"]],
  },
  {
    id: "glucose", title: "Needle-free glucose monitor", sub: "Wearable · near-infrared",
    cats: ["ml", "product"], when: "", h: 250,
    cover: { type: "chart", bg: "#d4f2e4", bars: [3, 5, 4, 7, 6, 8, 7] },
    problem: "Finger pricks hurt, so people check less often than they should.",
    built: ["Wrist device reading about 18 near-infrared channels, sampling every 5 minutes over Bluetooth.", "I built the regression models against a commercial CGM as ground truth."],
    impact: "SVR reached an R² of about 0.70 on our first dataset.",
    stack: ["Python", "scikit-learn", "Hardware"],
    links: [["GitHub repo", "https://github.com/Sanjask/Non-Invasive-Glucose-Tracking"]],
  },
];

const EDUCATION = [
  { school: "Boston University", logo: "https://www.google.com/s2/favicons?domain=bu.edu&sz=128", degree: "Master of Science, Computer Science", when: "Sep 2025 to Dec 2026", where: "Boston, US", note: "" },
  { school: "Indraprastha Institute of Information Technology, Delhi", logo: "https://www.google.com/s2/favicons?domain=iiitd.ac.in&sz=128", degree: "B.Tech, Computer Science and Engineering", when: "Sep 2021 to May 2025", where: "New Delhi, India", note: "Minor in Human-Centered Design" },
];

const SCHOLARSHIPS = [
  { amount: "$20,000", title: "Merit scholarship", school: "Boston University", detail: "Merit-based award for my master's in Computer Science", bg: "#ffd6e0" },
  { amount: "50%", title: "Merit scholarship, all 4 years", school: "IIIT Delhi", detail: "Merit-based tuition scholarship for my entire undergrad", bg: "#fff1b8" },
];

const PUBLICATIONS = [
  {
    title: "Optimizing Multimodal LLM for Scientific VQA through Caption-Aware Supervised Training",
    venue: "AAAI '25", year: "2025",
    authors: "Janak Kapuriya, Anwar Shaikh, Arnav Goel, Medha Hira, Apoorv Singh, Jay Saraf, Sanjana, Vaibhav Nauriyal, Avinash Anand, Zhengkui Wang, Rajiv Ratn Shah",
    summary: "Feeding image captions alongside questions during fine-tuning helps smaller vision-language models on scientific VQA. Also releases a 2,245-question Hindi visual QA set.",
    link: "https://arxiv.org/abs/2509.16628",
  },
  {
    title: "Mathify: Evaluating Large Language Models on Mathematical Problem Solving Tasks",
    venue: "NeurIPS '23", year: "2023",
    authors: "Avinash Anand, Mohit Gupta, Kritarth Prasad, Navya Singla, Sanjana Sanjeev, Jatin Kumar, Adarsh Raj Shivam, Rajiv Ratn Shah",
    summary: "Introduces MathQuest, a dataset built from NCERT 11th and 12th grade textbooks, and evaluates fine-tuned LLaMA-2, WizardMath and MAmmoTH on it. I created the dataset.",
    link: "https://arxiv.org/abs/2404.13099",
  },
];

const LIFE = [
  // Drop a photo into img/life/ with the matching name and it replaces the illustration.
  { title: "Volleyball", text: "Bump, set, spike", img: "img/life/volleyball.jpg", cover: "volleyball", bg: "#bfe0ff", h: 300 },
  { title: "Music", text: "Always hunting for the next song on repeat", img: "img/life/music.jpg", cover: "music", bg: "#e4dbff", h: 250 },
  { title: "Trekking", text: "The best views are the ones you climb for", img: "img/life/trekking.jpg", cover: "trek", bg: "#d7f5e6", h: 320 },
  { title: "Visual design", text: "See my design work on Behance", img: "img/life/design.jpg", cover: "design", bg: "#ffd6e0", h: 270, link: "https://www.behance.net/sanjanaiiitd" },
];
