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
  bgHero: "",
  bgAbout: "",
  bgSkills: "",
  bgServices: "",
  bgProjects: "",
  bgContact: ""
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
    id: "ecommerce-platform",
    title: "Full-Stack E-Commerce Platform",
    category: "web",
    description: "A complete e-commerce solution with user auth, shopping cart, product filtering, order management, and checkout workflow.",
    longDescription: "A comprehensive e-commerce platform built to solve real-world online shopping demands. It features robust role-based access control, relational database modeling in PostgreSQL, order lifecycle states, and product inventory tracking.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=80",
    techStack: ["Python", "Django", "PostgreSQL", "JavaScript", "HTML/CSS"],
    githubUrl: "https://github.com/Rashi0099",
    liveUrl: "",
    features: [
      "User authentication, profile management, and password reset",
      "Dynamic product catalog with category and price filters",
      "Shopping cart session management and seamless checkout",
      "Order tracking history and status updates",
      "Admin dashboard for inventory management"
    ],
    challenges: "Handling concurrent stock deductions during checkout and ensuring atomic database transactions."
  },
  {
    id: "task-workflow-manager",
    title: "Task & Workflow Management App",
    category: "python",
    description: "Collaborative project and task tracking dashboard with status columns, priorities, and deadline notifications.",
    longDescription: "Designed for development teams to organize sprints, assign tasks, and track project milestones with clean status updates and reporting.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    techStack: ["Python", "Django REST", "SQLite", "JavaScript", "Bootstrap"],
    githubUrl: "https://github.com/Rashi0099",
    liveUrl: "",
    features: [
      "Drag-and-drop workflow status updating",
      "Priority badges and deadline countdown tracking",
      "User role authorization and team collaboration boards",
      "Clean REST API endpoints for seamless frontend syncing"
    ],
    challenges: "Designing an efficient relational schema connecting users, projects, and task dependencies without N+1 query overhead."
  },
  {
    id: "developer-portfolio-cms",
    title: "Modern Portfolio & Real-Time CMS",
    category: "frontend",
    description: "Interactive portfolio and custom admin CMS with dark glassmorphic styling, live Firebase syncing, and case studies.",
    longDescription: "A high-performance personal developer portfolio and content management dashboard built with React and Vite. Allows the owner to modify projects, skills, services, and read messages in real time.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    techStack: ["React", "Vite", "Tailwind CSS", "Firebase", "Lucide Icons"],
    githubUrl: "https://github.com/Rashi0099/portfolio",
    liveUrl: "",
    features: [
      "Instant page render with zero-delay fallback caching",
      "Protected admin dashboard with Firebase authentication",
      "Real-time Firestore listeners for instant content updates",
      "Direct image uploads to Firebase Storage with progress indicators",
      "Responsive glassmorphism design with mobile navigation"
    ],
    challenges: "Building a fluid SPA that loads immediately while syncing seamlessly with cloud data."
  }
];

export const FALLBACK_SOCIALS = [
  { id: "soc-gh", name: "GitHub", url: "https://github.com/Rashi0099", icon: "Github" },
  { id: "soc-li", name: "LinkedIn", url: "https://www.linkedin.com/", icon: "Linkedin" },
  { id: "soc-em", name: "Email", url: "mailto:abdulrasheed5140@gmail.com", icon: "Mail" }
];
