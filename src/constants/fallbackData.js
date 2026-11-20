export const FALLBACK_SETTINGS = {
  subtitle: "Hello, I'm",
  name: "Abdul Rasheed YP",
  roles: "Python Full-Stack Developer, Django Developer, Backend Specialist, Web Developer",
  heroDesc: "I build scalable, robust, and user-friendly web applications. Passionate about Python, backend architecture, and continuous learning.",
  about: `I'm a commerce graduate transitioning into software development, currently focused on building practical web applications using Python.

I train at Brototype, where my learning is fully project-driven — writing real code, solving real problems, and following industry-level development practices.

My goal is to become a job-ready full-stack developer with strong fundamentals in backend development, databases, and clean frontend design.`,
  phone: "+91 9778106863",
  email: "abdulrasheed5140@gmail.com",
  location: "Malappuram, Kerala, India",
  profileImg: "/img/profile-pic.png",
  resumeUrl: "/img/AbdulrasheedCV.pdf",
  freelanceState: "available",
  bgHero: "/img/working_with_lap.jpg",
  bgAbout: "/img/working_with_lap.jpg",
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
  { id: "sk-postgres", name: "PostgreSQL", icon: "Database", color: "#336791", order: 3 },
  { id: "sk-js", name: "JavaScript", icon: "FileCode2", color: "#F7DF1E", order: 4 },
  { id: "sk-react", name: "React", icon: "Atom", color: "#00d9ff", order: 5 },
  { id: "sk-html", name: "HTML5 & CSS3", icon: "Layout", color: "#E34F26", order: 6 },
  { id: "sk-tailwind", name: "Tailwind CSS", icon: "Palette", color: "#06B6D4", order: 7 },
  { id: "sk-git", name: "Git & GitHub", icon: "GitBranch", color: "#F05032", order: 8 },
  { id: "sk-rest", name: "REST APIs", icon: "Network", color: "#a855f7", order: 9 }
];

export const FALLBACK_SERVICES = [
  {
    id: "srv-backend",
    title: "Backend Development",
    description: "Building robust, secure, and scalable server-side systems and RESTful APIs using Python, Django, and modern best practices.",
    icon: "Server"
  },
  {
    id: "srv-fullstack",
    title: "Full-Stack Web Apps",
    description: "End-to-end modern web applications combining responsive frontend experiences with well-architected backend services.",
    icon: "Globe"
  },
  {
    id: "srv-database",
    title: "Database Architecture",
    description: "Designing optimized relational database schemas, complex SQL queries, and efficient data models with PostgreSQL.",
    icon: "Database"
  },
  {
    id: "srv-api",
    title: "API Development & Integration",
    description: "Designing clean REST APIs and integrating third-party services, payment gateways, and authentication protocols.",
    icon: "Cpu"
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
  { id: "soc-gh", name: "GitHub", url: "https://github.com/Rashi0099", icon: "Github" },
  { id: "soc-li", name: "LinkedIn", url: "https://www.linkedin.com/", icon: "Linkedin" },
  { id: "soc-em", name: "Email", url: "mailto:abdulrasheed5140@gmail.com", icon: "Mail" }
];

export const FALLBACK_JOURNEY = [
  {
    id: "j-brototype",
    period: "2025 – Present",
    role: "Python Full-Stack Developer Trainee",
    organization: "Brototype",
    badge: "Intensive Tech Immersion",
    current: true,
    icon: "fas fa-laptop-code",
    color: "#00d9ff",
    description:
      "Undergoing rigorous project-driven software development training focusing on production-grade Python architectures, real-world database design, and end-to-end web deployment.",
    highlights: [
      "Built production-ready e-commerce systems featuring automated wallet refunds, promotional offer coupon engines, cart & wishlist logic, and custom administration panels.",
      "Hands-on expertise with Django framework, PostgreSQL relational schema modeling, and RESTful API architecture.",
      "Practical cloud deployment on AWS EC2 with Nginx reverse proxy and Gunicorn.",
      "Daily problem-solving, code reviews, and Git collaboration adhering to industry-level standards."
    ],
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "AWS EC2", "Nginx", "Git"]
  },
  {
    id: "j-bcom",
    period: "2022 – 2025",
    role: "Bachelor of Commerce (B.Com)",
    organization: "Undergraduate Degree",
    badge: "Foundation in Analytics",
    current: false,
    icon: "fas fa-graduation-cap",
    color: "#a855f7",
    description:
      "Graduated with a solid foundation in commercial operations, financial data analysis, and business management. This background provides a distinct advantage in architecting robust business logic and real-world application workflows.",
    highlights: [
      "Developed sharp analytical thinking and structured quantitative problem-solving abilities.",
      "Gained deep insight into business processes, financial transactions, and workflow optimization.",
      "Disciplined approach to deadlines, documentation, and continuous self-improvement."
    ],
    skills: ["Business Logic", "Analytical Reasoning", "Financial Data", "Workflow Design"]
  }
];
