export const FALLBACK_SETTINGS = {
  subtitle: "Hello, I'm",
  name: "Abdul Rasheed YP",
  roles: "Python Backend Developer, Backend Engineering, AI Systems Integration, Django & DRF Specialist, Cloud & PostgreSQL",
  heroDesc: "Python Backend Developer specializing in API-driven applications, relational database architecture, and LLM-powered multi-step agent workflows. Experienced in Django, DRF, PostgreSQL, and AWS EC2 deployment.",
  about: `Python Backend Developer with hands-on project experience building API-driven applications using Python, Django, Django REST Framework, and PostgreSQL.

Alongside backend development, I focus on LLM-powered application engineering, including LLM API integration, function calling, and multi-step agent workflows that connect language models with application logic and tools.

My technical foundation also includes secure authentication, relational data design, frontend integration, and production deployment using AWS EC2, Gunicorn, and Nginx.`,
  phone: "+91 9778106863",
  email: "abdulrasheed5140@gmail.com",
  location: "Kerala, India",
  profileImg: "/img/profile-pic.png",
  resumeUrl: "/img/AbdulRasheedCV_new.pdf",
  freelanceState: "available",
  bgHero: "/img/working_with_lap.jpg",
  bgAbout: "/img/working_with_lap.jpg",
  bgJourney: "",
  journeyBanner: "/img/sitting_working.jpeg",
  bgSkills: "/img/lap.jpg",
  bgServices: "/img/lap.jpg",
  bgProjects: "/img/lap.jpg",
  bgContact: "/img/team.jpeg",
  bgGal1: "/img/elephant.png",
  bgGal2: "/img/firnds.jpeg",
  bgGal3: "/img/office.png",
  bgGal4: "/img/sitting_working.jpeg",
  bgGal5: "/img/team.jpeg",
  bgGal6: "/img/working.jpeg",
  bgGal7: "/img/working_with_lap.jpg"
};

export const formatBgUrl = (url) => {
  if (!url) return undefined;
  let trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.endsWith(".jpe")) trimmed += "g";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return `/${trimmed}`;
};

export const formatBgStyle = (url) => {
  if (!url || typeof url !== "string" || !url.trim() || url.trim() === "none") {
    return { backgroundImage: "none" };
  }
  const formatted = formatBgUrl(url);
  if (!formatted) return { backgroundImage: "none" };
  return { backgroundImage: `url('${formatted}')` };
};

export const FALLBACK_SKILLS = [
  { id: "sk-python", name: "Python", icon: "Code2", color: "#3776AB", order: 1 },
  { id: "sk-django", name: "Django", icon: "Server", color: "#092E20", order: 2 },
  { id: "sk-drf", name: "Django REST Framework", icon: "Network", color: "#a855f7", order: 3 },
  { id: "sk-postgres", name: "PostgreSQL & SQL", icon: "Database", color: "#336791", order: 4 },
  { id: "sk-ai-llm", name: "LLM & AI Integration", icon: "Cpu", color: "#10B981", order: 5 },
  { id: "sk-agentic", name: "Agentic AI & Function Calling", icon: "Sparkles", color: "#06B6D4", order: 6 },
  { id: "sk-aws", name: "AWS EC2 & Linux", icon: "Globe", color: "#FF9900", order: 7 },
  { id: "sk-nginx", name: "Gunicorn & Nginx", icon: "Server", color: "#009639", order: 8 },
  { id: "sk-testing", name: "Pytest & Postman", icon: "CheckCircle", color: "#EC4899", order: 9 },
  { id: "sk-react", name: "React.js", icon: "Atom", color: "#00d9ff", order: 10 },
  { id: "sk-js", name: "JavaScript", icon: "FileCode2", color: "#F7DF1E", order: 11 },
  { id: "sk-tailwind", name: "Tailwind CSS", icon: "Palette", color: "#38BDF8", order: 12 },
  { id: "sk-git", name: "Git & GitHub", icon: "GitBranch", color: "#F05032", order: 13 }
];

export const FALLBACK_SERVICES = [
  {
    id: "srv-backend",
    title: "Backend Engineering",
    description: "Building robust, secure, and scalable server-side systems and RESTful APIs using Python, Django, and Django REST Framework.",
    icon: "Server"
  },
  {
    id: "srv-ai",
    title: "AI Systems & LLM Integration",
    description: "Developing LLM-powered applications, function calling, and multi-step agent workflows that connect language models to application logic.",
    icon: "Cpu"
  },
  {
    id: "srv-database",
    title: "Database Architecture",
    description: "Designing optimized relational database schemas, complex SQL queries, and efficient data models with PostgreSQL.",
    icon: "Database"
  },
  {
    id: "srv-cloud",
    title: "API Development & Cloud Deployment",
    description: "Implementing secure JWT authentication, access control mechanisms, and deploying production environments using AWS EC2, Gunicorn, and Nginx.",
    icon: "Globe"
  }
];

export const FALLBACK_PROJECTS = [
  {
    id: "ZoeZX4xucPEgPrWAnRQl",
    title: "E-Commerce Platform",
    category: "python",
    description: "Full-featured footwear e-commerce platform with offer coupons, wishlist, cart, order tracking, custom admin dashboard, and automated wallet refund system.",
    longDescription: "Shoedrop is a robust full-stack e-commerce application built using Django and PostgreSQL. It features a complete online shopping experience including product catalog filtering, cart & wishlist management, promotional offer coupon engines, and user wallet integration with automated refunds. On the management side, it includes a custom administrative dashboard for tracking orders, managing product stock, handling discount coupons, and controlling user accounts.",
    image: "/img/shoedrop-1.png",
    images: [
      {
        url: "/img/shoedrop-1.png",
        title: "Product Catalog & Storefront",
        desc: "Interactive storefront with category filtering, instant search, stock indicators, and dynamic price calculations."
      },
      {
        url: "/img/shoedrop-2.png",
        title: "Admin Management Dashboard",
        desc: "Custom management console featuring sales analytics, inventory level control, coupon configuration, and order status updates."
      },
      {
        url: "/img/shoedrop-3.png",
        title: "Cart & Checkout Flow",
        desc: "Streamlined multi-step checkout workflow with promotional coupon validation and instant wallet refund capabilities."
      }
    ],
    techStack: ["Python", "Django", "PostgreSQL", "Tailwind CSS", "JavaScript", "AWS EC2", "Nginx"],
    githubUrl: "https://github.com/Rashi0099/Shoedrop_E-Commerce_Platform.git",
    liveUrl: "https://github.com/Rashi0099/Shoedrop_E-Commerce_Platform.git",
    features: [
      "Custom Admin Dashboard for Inventory & Sales Control",
      "Promotional Offer Coupons & Discount Engine",
      "Shopping Cart & Interactive Wishlist Management",
      "Order Tracking & Cancel/Return Management",
      "User Wallet & Automated Refund System",
      "Product Filtering, Search & Stock Management",
      "RESTful API Endpoints with Django REST Framework"
    ]
  }
];

export const FALLBACK_SOCIALS = [
  { id: "soc-gh", name: "GitHub", url: "https://github.com/AbdulRasheedYP", icon: "fab fa-github" },
  { id: "soc-li", name: "LinkedIn", url: "https://www.linkedin.com/in/abdulrasheedyp/", icon: "fab fa-linkedin" },
  { id: "soc-em", name: "Email", url: "mailto:abdulrasheed5140@gmail.com", icon: "fas fa-envelope" }
];

export const DEFAULT_BROTOTYPE_SPRINTS = [
  {
    id: "sp-1",
    period: "Month 1",
    title: "Python Core & Algorithmic Problem Solving",
    description: "Mastered Python syntax, OOP concepts, Data Structures & Algorithms, and problem-solving through daily coding challenges.",
    skills: ["Python 3", "OOP", "DSA", "Clean Code", "Git"],
    current: false,
    order: 1,
    type: "sprint"
  },
  {
    id: "sp-2",
    period: "Month 2",
    title: "Database Engineering & Web Essentials",
    description: "Designed relational schemas with PostgreSQL, complex queries, table normalization, indexing & responsive HTML5/CSS3/JavaScript.",
    skills: ["PostgreSQL", "SQL Relational Schemas", "Query Tuning", "JavaScript", "HTML5 & CSS3"],
    current: false,
    order: 2,
    type: "sprint"
  },
  {
    id: "sp-3",
    period: "Month 3",
    title: "Django Framework & RESTful APIs",
    description: "Architected web apps with Django MVT, Django REST Framework (DRF), JWT token authentication, and ORM query optimization.",
    skills: ["Django", "Django REST Framework", "JWT Auth", "API Design", "ORM"],
    current: false,
    order: 3,
    type: "sprint"
  },
  {
    id: "sp-4",
    period: "Month 4 — Present",
    title: "Production Systems, DevOps & Deployment",
    description: "Developing production-grade systems with complex logic (wallets, offer discounts, admin dashboard) and deploying to AWS EC2 with Nginx & Linux.",
    skills: ["Full-Stack Systems", "AWS EC2", "Nginx", "Linux CLI", "Gunicorn"],
    current: true,
    order: 4,
    type: "sprint"
  }
];

export const FALLBACK_JOURNEY = [
  {
    id: "j-bcom",
    period: "2022 — 2025",
    title: "Bachelor of Commerce (B.Com)",
    subtitle: "Sullamussalam Science College • University of Calicut | 2025",
    badge: "Academic Foundation",
    type: "academic",
    current: false,
    order: 1,
    icon: "GraduationCap",
    description:
      "Developed strong quantitative reasoning, structured analytical thinking, and an in-depth understanding of commercial workflows and business logic.",
    skills: ["Business Workflows", "Data Logic", "Systematic Analysis"]
  },
  {
    id: "j-brototype",
    period: "2025 — Present",
    title: "Software Development Training Program",
    subtitle: "Brototype • Duration: 2 Years | Intensive Project-Driven Training",
    badge: "Active Developer",
    type: "tech",
    current: true,
    order: 2,
    icon: "Code2",
    description:
      "Undergoing intensive project-driven software development training, architecting full-stack web applications, database schemas, REST APIs, and production deployment.",
    skills: ["Python & Django", "DRF & PostgreSQL", "LLM Integration", "AWS EC2 & Linux"],
    sprints: DEFAULT_BROTOTYPE_SPRINTS
  }
];
