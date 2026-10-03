/**
 * CareerSathi Intelligent Career Diagnostic Engine
 * Multi-dimensional psychometric and aptitude evaluation model
 */

export const assessmentQuestions = [
  {
    id: "q1",
    type: "mcq",
    dimension: "WorkStyle",
    text: "When tackling a major technical or business challenge, which work setting brings out your best?",
    options: [
      "Deep individual focus — breaking problems down independently in quiet flow",
      "Collaborating in a tight-knit, cross-functional team with agile daily syncs",
      "Stepping up to coordinate roadmap vision, timeline, and mentor teammates",
      "Executing structured, well-documented requirements with high precision"
    ]
  },
  {
    id: "q2",
    type: "likert",
    dimension: "Logic",
    text: "I thrive when untangling complex logic puzzles, debugging obscure errors, or tracing system algorithms.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q3",
    type: "mcq",
    dimension: "Interest",
    text: "Which of the following activities makes time fly by the fastest for you?",
    options: [
      "Building interactive software, web apps, or automating repetitive tasks with scripts",
      "Analyzing datasets, visualizing hidden metrics, and spotting market trends",
      "Designing clean visual interfaces, brand aesthetics, and intuitive user experiences",
      "Organizing projects, pitching business concepts, and resolving community problems"
    ]
  },
  {
    id: "q4",
    type: "likert",
    dimension: "Communication",
    text: "I feel confident presenting technical ideas or project proposals persuasively to an audience.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q5",
    type: "mcq",
    dimension: "DecisionMaking",
    text: "When making critical career or project decisions under pressure, you primarily rely on:",
    options: [
      "Rigorous quantitative evidence, data benchmarks, and empirical test results",
      "User feedback, emotional empathy, and human impact on real people",
      "Strategic market feasibility, cost efficiency, and long-term scalability",
      "Creative experimentation, rapid prototyping, and learned intuition"
    ]
  },
  {
    id: "q6",
    type: "likert",
    dimension: "Quantitative",
    text: "I enjoy working with mathematical modeling, statistics, predictive calculations, or financial projections.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q7",
    type: "mcq",
    dimension: "Technology",
    text: "Which technology frontier sparks the deepest curiosity in you today?",
    options: [
      "Generative AI, Large Language Models, and Machine Learning systems",
      "Scalable Cloud Architecture, DevOps automation, and Cyber Security defenses",
      "Modern Web & Mobile apps with sleek micro-interactions and animations",
      "FinTech, algorithmic investing, data pipelines, and economic modeling"
    ]
  },
  {
    id: "q8",
    type: "likert",
    dimension: "Creativity",
    text: "I constantly seek original, unconventional ways to solve problems rather than sticking to conventional recipes.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q9",
    type: "mcq",
    dimension: "Motivation",
    text: "What represents your highest priority in your immediate 3-5 year career horizon?",
    options: [
      "Attaining deep technical craft mastery and recognized domain engineering excellence",
      "Achieving high financial growth, stability, and fast salary progression",
      "Creating tangible social impact that uplifts underprivileged families and communities",
      "Starting an entrepreneurial venture or leading a fast-scaling product team"
    ]
  },
  {
    id: "q10",
    type: "likert",
    dimension: "Adaptability",
    text: "When faced with completely unfamiliar frameworks or domains, I adapt quickly through self-directed learning.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  }
];

const likertScoreMap = {
  "Strongly Disagree": 20,
  "Disagree": 40,
  "Neutral": 60,
  "Agree": 80,
  "Strongly Agree": 100
};

export const careerCatalog = {
  software_engineer: {
    title: "Full-Stack Software Engineer",
    archetype: "The Analytical Systems Architect",
    summary: "Demonstrates strong logical decomposition, systematic debugging aptitude, and high resilience in navigating modern application architecture.",
    salaryRange: "₹6,00,000 - ₹18,50,000 / yr",
    marketDemand: "High Growth (+28% YoY Hiring in India & Global Remote)",
    skills: [
      "Modern JavaScript & TypeScript",
      "React.js & Modern Web Architecture",
      "Node.js Backend & API Engineering",
      "PostgreSQL / MongoDB Data Modeling",
      "Git, CI/CD & Cloud Deployment (Docker)"
    ],
    growthAreas: [
      "Distributed system concurrency & caching",
      "Advanced test automation (Unit & E2E)",
      "High-throughput microservices architecture"
    ],
    roadmap: [
      {
        step: 1,
        title: "Programming Foundations & Data Structures",
        duration: "Month 1 - 2",
        description: "Master clean code fundamentals, core data structures (Arrays, Trees, HashMaps), and Git version control.",
        actionItems: ["Complete CS50 / freeCodeCamp modules", "Solve 50 fundamental algorithmic exercises", "Host projects on GitHub"]
      },
      {
        step: 2,
        title: "Full-Stack Web Development & Modern Frontend",
        duration: "Month 3 - 4",
        description: "Build reactive, accessible applications with React, Tailwind CSS, TypeScript, and state management.",
        actionItems: ["Build 2 production-ready web apps", "Implement secure JWT authentication and role-based views"]
      },
      {
        step: 3,
        title: "Backend Services & Database Architecture",
        duration: "Month 5 - 6",
        description: "Architect robust RESTful APIs with Node.js/Express, relational databases, indexing, and input validation.",
        actionItems: ["Design normalized PostgreSQL schemas", "Write integration tests with Supertest and Jest"]
      },
      {
        step: 4,
        title: "Cloud Deployment, Containers & DevOps Basics",
        duration: "Month 7 - 8",
        description: "Containerize applications with Docker, deploy on Cloud (AWS/Render), and set up automated CI/CD pipelines.",
        actionItems: ["Write Dockerfile & docker-compose configurations", "Deploy live full-stack application with SSL & custom domain"]
      },
      {
        step: 5,
        title: "System Design, Open Source & Job Placement",
        duration: "Month 9 - 10",
        description: "Prepare for high-bar technical interviews, contribute to open-source software, and polish portfolio.",
        actionItems: ["Publish 1 open-source contribution", "Mock interview rounds & system design whiteboarding"]
      }
    ]
  },
  ai_data_specialist: {
    title: "AI & Machine Learning Specialist",
    archetype: "The Algorithmic Intelligence Pioneer",
    summary: "Combines sharp mathematical reasoning with predictive curiosity, primed for training models and developing AI applications.",
    salaryRange: "₹8,00,000 - ₹24,00,000 / yr",
    marketDemand: "Explosive Demand (+42% YoY GenAI & ML Expansion)",
    skills: [
      "Python & Scientific Stack (NumPy, Pandas)",
      "Machine Learning Algorithms & Scikit-Learn",
      "Deep Learning (PyTorch / TensorFlow)",
      "Large Language Models & Vector Databases (RAG)",
      "Data Pipelines & Statistical Inference"
    ],
    growthAreas: [
      "Production MLOps & model quantization",
      "GPU memory optimization for LLM inference",
      "Feature drift monitoring and governance"
    ],
    roadmap: [
      {
        step: 1,
        title: "Mathematical Foundations & Python Mastery",
        duration: "Month 1 - 2",
        description: "Establish strong foundations in Linear Algebra, Multivariate Calculus, Probability, and Python programming.",
        actionItems: ["Complete 3blue1brown Essence of Linear Algebra", "Master Pandas & NumPy on real datasets"]
      },
      {
        step: 2,
        title: "Classical Machine Learning & Exploratory Analysis",
        duration: "Month 3 - 4",
        description: "Implement regression, classification, clustering, cross-validation, and feature engineering workflows.",
        actionItems: ["Build predictive models on Kaggle datasets", "Implement model evaluation pipelines (Precision/Recall, ROC-AUC)"]
      },
      {
        step: 3,
        title: "Deep Learning & Neural Networks",
        duration: "Month 5 - 6",
        description: "Train CNNs for computer vision and Transformers for Natural Language Processing using PyTorch.",
        actionItems: ["Train custom text classification models", "Implement attention mechanisms from scratch"]
      },
      {
        step: 4,
        title: "Generative AI, RAG & Vector Databases",
        duration: "Month 7 - 8",
        description: "Build Retrieval-Augmented Generation (RAG) applications using LangChain, ChromaDB, and modern LLM APIs.",
        actionItems: ["Build production document Q&A assistant", "Fine-tune open-weights models (Llama/Mistral)"]
      },
      {
        step: 5,
        title: "MLOps, Portfolio Deployment & Career Launch",
        duration: "Month 9 - 10",
        description: "Deploy models via FastAPI and Docker, establish latency monitoring, and showcase end-to-end AI applications.",
        actionItems: ["Deploy live inference API on cloud", "Participate in AI hackathons & publish technical writeups"]
      }
    ]
  },
  cloud_devops_architect: {
    title: "Cloud Infrastructure & DevOps Engineer",
    archetype: "The High-Availability System Guardian",
    summary: "Excels in automated systems, infrastructure reliability, scalable networks, and high-uptime architectures for modern internet platforms.",
    salaryRange: "₹7,00,000 - ₹20,00,000 / yr",
    marketDemand: "Very High Demand (+31% YoY Enterprise Cloud Adoption)",
    skills: [
      "Linux Systems & Shell Scripting",
      "Cloud Providers (AWS / GCP / Azure)",
      "Infrastructure as Code (Terraform)",
      "Container Orchestration (Kubernetes & Docker)",
      "Continuous Integration & Continuous Delivery (CI/CD)"
    ],
    growthAreas: [
      "Chaos engineering & incident post-mortems",
      "FinOps cloud expenditure governance",
      "Zero-trust network architecture"
    ],
    roadmap: [
      {
        step: 1,
        title: "Linux Operating Systems & Bash Automation",
        duration: "Month 1 - 2",
        description: "Master UNIX fundamentals, process management, storage subsystems, and shell scripting.",
        actionItems: ["Setup Linux server lab", "Automate backup and log rotation scripts"]
      },
      {
        step: 2,
        title: "Cloud Fundamentals & Networking Architecture",
        duration: "Month 3 - 4",
        description: "Master Virtual Private Clouds (VPC), routing tables, IAM policies, and load balancing on AWS/GCP.",
        actionItems: ["Attain AWS Certified Cloud Practitioner / Solutions Architect", "Deploy multi-tier secure cloud network"]
      },
      {
        step: 3,
        title: "Infrastructure as Code & CI/CD Pipelines",
        duration: "Month 5 - 6",
        description: "Declaratively provision infrastructure with Terraform and build automated GitHub Actions pipelines.",
        actionItems: ["Provision reproducible cloud environments with Terraform", "Automate automated linting, test, and deploy workflows"]
      },
      {
        step: 4,
        title: "Containerization & Kubernetes Orchestration",
        duration: "Month 7 - 8",
        description: "Deploy and manage microservices clusters, ingress controllers, and auto-scaling configurations.",
        actionItems: ["Deploy multi-pod application on K8s cluster", "Configure Prometheus & Grafana telemetry dashboards"]
      },
      {
        step: 5,
        title: "Site Reliability Engineering (SRE) & Certification",
        duration: "Month 9 - 10",
        description: "Practice disaster recovery drills, implement service level objectives (SLOs), and prepare for DevOps interviews.",
        actionItems: ["Simulate cluster failover and recovery", "Apply for junior SRE / DevOps roles"]
      }
    ]
  },
  product_designer: {
    title: "UI/UX Product Designer & Design Engineer",
    archetype: "The Human-Centered Creative Visionary",
    summary: "Balances aesthetic intuition with structured user empathy, crafting intuitive digital products that solve real human problems.",
    salaryRange: "₹5,50,000 - ₹16,50,000 / yr",
    marketDemand: "Steady Growth (+24% YoY Design-Led Product Teams)",
    skills: [
      "Figma Advanced Design Systems & Variables",
      "User Research, Personas & Usability Testing",
      "Wireframing & Interactive Prototyping",
      "Front-End Implementation (HTML, Tailwind CSS)",
      "Micro-Interactions & Animation (Framer Motion)"
    ],
    growthAreas: [
      "Quantitative product analytics (Mixpanel/Amplitude)",
      "Design accessibility standards (WCAG AAA)",
      "Design system synchronization with code"
    ],
    roadmap: [
      {
        step: 1,
        title: "Visual Design Principles & Figma Mastery",
        duration: "Month 1 - 2",
        description: "Master typography hierarchy, spatial grids, color theory, and Figma auto-layout components.",
        actionItems: ["Create 3 responsive landing page mockups", "Build a reusable token-based Figma design library"]
      },
      {
        step: 2,
        title: "User Experience Research & Discovery",
        duration: "Month 3 - 4",
        description: "Conduct user interviews, map user journeys, create empathy maps, and identify workflow friction points.",
        actionItems: ["Conduct usability tests with 5 real users", "Synthesize findings into problem statements and personas"]
      },
      {
        step: 3,
        title: "Interactive Prototyping & Motion Design",
        duration: "Month 5 - 6",
        description: "Design high-fidelity interactive prototypes with smart animations and realistic micro-interactions.",
        actionItems: ["Build high-fidelity mobile prototype with complex interactions", "Test prototype usability iteratively"]
      },
      {
        step: 4,
        title: "Design Engineering & Code Parity",
        duration: "Month 7 - 8",
        description: "Translate designs directly into pixel-perfect React and Tailwind CSS components.",
        actionItems: ["Implement responsive design in clean code", "Audit accessibility with Lighthouse and screen readers"]
      },
      {
        step: 5,
        title: "Case Study Portfolio & Industry Review",
        duration: "Month 9 - 10",
        description: "Publish 2 in-depth case studies detailing problem statements, research insights, and verified outcomes.",
        actionItems: ["Launch personal design portfolio", "Participate in design critiques with senior mentors"]
      }
    ]
  },
  technical_pm: {
    title: "Technical Product Manager",
    archetype: "The Strategic Product Catalyst",
    summary: "Excels in strategic communication, stakeholder alignment, user advocacy, and cross-functional leadership.",
    salaryRange: "₹8,50,000 - ₹22,00,000 / yr",
    marketDemand: "High Demand (+26% YoY Tech Leadership & Product Management)",
    skills: [
      "Product Strategy & Vision Mapping",
      "User Discovery & Requirement Documentation (PRDs)",
      "Agile, Scrum & Sprint Delivery",
      "Data Analytics & A/B Experimentation",
      "Cross-Functional Stakeholder Communication"
    ],
    growthAreas: [
      "Technical architecture feasibility analysis",
      "Unit economics and P&L modeling",
      "Go-to-market enterprise sales coordination"
    ],
    roadmap: [
      {
        step: 1,
        title: "Product Fundamentals & Market Research",
        duration: "Month 1 - 2",
        description: "Understand product life cycles, competitive benchmarking, customer discovery, and value proposition design.",
        actionItems: ["Analyze 3 successful tech case studies", "Formulate clear problem-solution fit hypotheses"]
      },
      {
        step: 2,
        title: "User Discovery & Product Requirement Docs (PRDs)",
        duration: "Month 3 - 4",
        description: "Learn to write crisp, unambiguous Product Requirement Documents and user stories with clear acceptance criteria.",
        actionItems: ["Author 2 comprehensive PRDs for real software problems", "Define core success metrics (North Star, OKRs)"]
      },
      {
        step: 3,
        title: "Agile Execution & Cross-Functional Collaboration",
        duration: "Month 5 - 6",
        description: "Lead sprint planning, backlog grooming, sprint retrospectives, and coordinate between engineers and designers.",
        actionItems: ["Manage mock sprint board in Jira/Linear", "Run backlog prioritization using RICE / MoSCoW frameworks"]
      },
      {
        step: 4,
        title: "Data-Driven Decision Making & Experimentation",
        duration: "Month 7 - 8",
        description: "Analyze user retention cohorts, funnel drop-offs, and design statistically sound A/B tests.",
        actionItems: ["Construct user analytics funnel dashboards", "Design A/B testing experiment spec"]
      },
      {
        step: 5,
        title: "Product Portfolio, Teardowns & Job Search",
        duration: "Month 9 - 10",
        description: "Build an executive product teardown portfolio and master product management behavioral & case interviews.",
        actionItems: ["Publish 2 detailed product teardowns on LinkedIn/Substack", "Practice circular case interview frameworks"]
      }
    ]
  },
  cybersecurity_analyst: {
    title: "Cybersecurity & Defense Specialist",
    archetype: "The Threat Intelligence Guardian",
    summary: "Deeply analytical mindset focused on security postures, ethical penetration testing, vulnerability assessments, and threat mitigation.",
    salaryRange: "₹6,50,000 - ₹19,00,000 / yr",
    marketDemand: "Severe Shortage (+35% YoY Cybersecurity Talent Deficit)",
    skills: [
      "Network Protocols & Packet Analysis (Wireshark)",
      "Linux Hardening & Vulnerability Assessment",
      "Web Application Security (OWASP Top 10)",
      "Security Operations Center (SIEM) Monitoring",
      "Ethical Hacking & Penetration Testing Tools"
    ],
    growthAreas: [
      "Cloud infrastructure security (AWS/Azure IAM)",
      "Reverse engineering & malware analysis",
      "Incident response forensic reporting"
    ],
    roadmap: [
      {
        step: 1,
        title: "Networking Fundamentals & Protocol Analysis",
        duration: "Month 1 - 2",
        description: "Master TCP/IP suite, DNS, TLS/SSL, firewalls, and network packet capture with Wireshark.",
        actionItems: ["Analyze network traffic dumps in Wireshark", "Attain CompTIA Network+ / Security+ foundations"]
      },
      {
        step: 2,
        title: "System Administration & OS Hardening",
        duration: "Month 3 - 4",
        description: "Implement Linux and Windows security hardening, access controls, SSH keys, and system auditing.",
        actionItems: ["Configure hardened Linux server", "Perform privilege escalation labs on TryHackMe"]
      },
      {
        step: 3,
        title: "Web Security & OWASP Top 10 Vulnerabilities",
        duration: "Month 5 - 6",
        description: "Identify and remediate SQL injection, Cross-Site Scripting (XSS), CSRF, and broken access controls.",
        actionItems: ["Complete PortSwigger Web Security Academy modules", "Run vulnerability scans with Burp Suite"]
      },
      {
        step: 4,
        title: "SOC Operations & Threat Detection",
        duration: "Month 7 - 8",
        description: "Configure Security Information and Event Management (SIEM) platforms, analyze log alerts, and hunt threats.",
        actionItems: ["Set up Splunk / Wazuh monitoring lab", "Investigate simulated cyber attack scenarios"]
      },
      {
        step: 5,
        title: "Certifications & Industry Placement",
        duration: "Month 9 - 10",
        description: "Prepare for certified cybersecurity examinations (CEH, eJPT, Security+) and participate in CTF competitions.",
        actionItems: ["Earn eJPT or CompTIA Security+ certification", "Compete in Capture The Flag (CTF) challenges"]
      }
    ]
  },
  fintech_analyst: {
    title: "FinTech & Financial Data Analyst",
    archetype: "The Quantitative Market Strategist",
    summary: "Blends strong mathematical and financial reasoning with analytical rigor to decode financial markets and economic systems.",
    salaryRange: "₹7,50,000 - ₹21,00,000 / yr",
    marketDemand: "High Growth (+29% YoY FinTech & Digital Banking in India)",
    skills: [
      "Financial Modeling & Business Valuation",
      "SQL Querying & Financial Databases",
      "Python for Finance & Quantitative Analysis",
      "Digital Payment Rails & FinTech Architectures",
      "Regulatory Compliance & Risk Assessment"
    ],
    growthAreas: [
      "Algorithmic trading strategy backtesting",
      "Time-series econometric forecasting",
      "Decentralized finance & blockchain settlement"
    ],
    roadmap: [
      {
        step: 1,
        title: "Financial Accounting & Valuation Foundations",
        duration: "Month 1 - 2",
        description: "Master financial statements, cash flow modeling, discounted cash flow (DCF), and ratio analysis.",
        actionItems: ["Build 3-statement financial models in Excel", "Complete corporate finance foundation courses"]
      },
      {
        step: 2,
        title: "SQL & Relational Financial Databases",
        duration: "Month 3 - 4",
        description: "Query enterprise databases, write complex window functions, and extract transactional financial insights.",
        actionItems: ["Query high-volume transactional datasets", "Calculate customer lifetime value and churn metrics"]
      },
      {
        step: 3,
        title: "Python for Quantitative Analysis",
        duration: "Month 5 - 6",
        description: "Use Pandas and Matplotlib to analyze stock price movements, portfolio volatility, and risk metrics.",
        actionItems: ["Backtest simple moving-average investment strategies", "Calculate Sharpe ratios and Value at Risk (VaR)"]
      },
      {
        step: 4,
        title: "FinTech Infrastructure & Payment Ecosystems",
        duration: "Month 7 - 8",
        description: "Study UPI architectures, card networks, payment gateways, credit scoring algorithms, and RBI regulations.",
        actionItems: ["Deconstruct UPI & payment gateway transaction flows", "Write an analytical report on Indian FinTech trends"]
      },
      {
        step: 5,
        title: "Portfolio Projects & Financial Analyst Hiring",
        duration: "Month 9 - 10",
        description: "Publish investment research notes and financial models to showcase commercial acumen.",
        actionItems: ["Publish 2 company valuation reports", "Interview with FinTech startups and financial institutions"]
      }
    ]
  }
};

/**
 * Intelligent deterministic scoring engine based on answers and user profile
 */
export function generateDiagnosticResult(answers = [], userProfile = {}) {
  // Safe default answers if empty
  const answerArray = Array.isArray(answers) ? answers : [];
  
  // Initialize dimension scores
  let scores = {
    Logic: 75,
    Creativity: 70,
    Communication: 72,
    Quantitative: 68,
    Leadership: 70,
    Resilience: 78
  };

  // Evaluate Question Answers
  answerArray.forEach((ans, idx) => {
    if (!ans) return;
    const strAns = String(ans);

    // Q1: Work style
    if (idx === 0) {
      if (strAns.includes("Deep individual focus")) {
        scores.Logic += 10;
        scores.Resilience += 8;
      } else if (strAns.includes("Collaborating in a tight-knit")) {
        scores.Communication += 10;
        scores.Leadership += 6;
      } else if (strAns.includes("Stepping up to coordinate")) {
        scores.Leadership += 14;
        scores.Communication += 10;
      } else {
        scores.Resilience += 8;
        scores.Logic += 6;
      }
    }

    // Q2: Logic Likert
    if (idx === 1) {
      const val = likertScoreMap[strAns] || 60;
      scores.Logic = Math.round((scores.Logic + val) / 2);
    }

    // Q3: Interest
    if (idx === 2) {
      if (strAns.includes("Building interactive software")) {
        scores.Logic += 12;
        scores.Resilience += 6;
      } else if (strAns.includes("Analyzing datasets")) {
        scores.Quantitative += 14;
        scores.Logic += 8;
      } else if (strAns.includes("Designing clean visual interfaces")) {
        scores.Creativity += 16;
      } else if (strAns.includes("Organizing projects")) {
        scores.Leadership += 12;
        scores.Communication += 12;
      }
    }

    // Q4: Communication Likert
    if (idx === 3) {
      const val = likertScoreMap[strAns] || 60;
      scores.Communication = Math.round((scores.Communication + val) / 2);
    }

    // Q5: Decision Making
    if (idx === 4) {
      if (strAns.includes("Rigorous quantitative evidence")) {
        scores.Quantitative += 10;
        scores.Logic += 8;
      } else if (strAns.includes("User feedback")) {
        scores.Communication += 10;
        scores.Creativity += 6;
      } else if (strAns.includes("Strategic market feasibility")) {
        scores.Leadership += 10;
        scores.Quantitative += 6;
      } else if (strAns.includes("Creative experimentation")) {
        scores.Creativity += 12;
      }
    }

    // Q6: Quantitative Likert
    if (idx === 5) {
      const val = likertScoreMap[strAns] || 60;
      scores.Quantitative = Math.round((scores.Quantitative + val) / 2);
    }

    // Q7: Technology
    if (idx === 6) {
      if (strAns.includes("Generative AI")) {
        scores.Logic += 10;
        scores.Quantitative += 10;
      } else if (strAns.includes("Scalable Cloud Architecture")) {
        scores.Logic += 10;
        scores.Resilience += 8;
      } else if (strAns.includes("Modern Web & Mobile apps")) {
        scores.Creativity += 8;
        scores.Logic += 6;
      } else if (strAns.includes("FinTech")) {
        scores.Quantitative += 12;
        scores.Leadership += 6;
      }
    }

    // Q8: Creativity Likert
    if (idx === 7) {
      const val = likertScoreMap[strAns] || 60;
      scores.Creativity = Math.round((scores.Creativity + val) / 2);
    }

    // Q9: Motivation
    if (idx === 8) {
      if (strAns.includes("technical craft mastery")) {
        scores.Logic += 8;
        scores.Resilience += 8;
      } else if (strAns.includes("financial growth")) {
        scores.Quantitative += 6;
        scores.Leadership += 6;
      } else if (strAns.includes("tangible social impact")) {
        scores.Communication += 8;
        scores.Leadership += 6;
      } else if (strAns.includes("entrepreneurial venture")) {
        scores.Leadership += 12;
        scores.Creativity += 8;
      }
    }

    // Q10: Adaptability Likert
    if (idx === 9) {
      const val = likertScoreMap[strAns] || 60;
      scores.Resilience = Math.round((scores.Resilience + val) / 2);
    }
  });

  // Factor in user profile text if provided
  const combinedProfileText = `${userProfile.education || ''} ${userProfile.skills || ''} ${userProfile.interests || ''} ${userProfile.careerGoal || ''}`.toLowerCase();
  if (combinedProfileText.includes('ai') || combinedProfileText.includes('data') || combinedProfileText.includes('python')) {
    scores.Quantitative += 6;
    scores.Logic += 4;
  }
  if (combinedProfileText.includes('design') || combinedProfileText.includes('ui') || combinedProfileText.includes('ux')) {
    scores.Creativity += 8;
  }
  if (combinedProfileText.includes('cloud') || combinedProfileText.includes('devops') || combinedProfileText.includes('linux')) {
    scores.Logic += 6;
    scores.Resilience += 6;
  }
  if (combinedProfileText.includes('business') || combinedProfileText.includes('management') || combinedProfileText.includes('lead')) {
    scores.Leadership += 8;
    scores.Communication += 6;
  }

  // Normalize scores within 60 to 98
  for (const k of Object.keys(scores)) {
    scores[k] = Math.max(65, Math.min(96, Math.round(scores[k])));
  }

  // Calculate compatibility for each career path
  const careerScores = [
    {
      key: 'software_engineer',
      score: Math.round(scores.Logic * 0.45 + scores.Resilience * 0.35 + scores.Quantitative * 0.20)
    },
    {
      key: 'ai_data_specialist',
      score: Math.round(scores.Quantitative * 0.45 + scores.Logic * 0.40 + scores.Resilience * 0.15)
    },
    {
      key: 'cloud_devops_architect',
      score: Math.round(scores.Logic * 0.40 + scores.Resilience * 0.40 + scores.Leadership * 0.20)
    },
    {
      key: 'product_designer',
      score: Math.round(scores.Creativity * 0.50 + scores.Communication * 0.30 + scores.Logic * 0.20)
    },
    {
      key: 'technical_pm',
      score: Math.round(scores.Leadership * 0.40 + scores.Communication * 0.40 + scores.Logic * 0.20)
    },
    {
      key: 'cybersecurity_analyst',
      score: Math.round(scores.Logic * 0.45 + scores.Quantitative * 0.30 + scores.Resilience * 0.25)
    },
    {
      key: 'fintech_analyst',
      score: Math.round(scores.Quantitative * 0.45 + scores.Leadership * 0.30 + scores.Logic * 0.25)
    }
  ];

  // Sort descending by calculated score
  careerScores.sort((a, b) => b.score - a.score);

  const topMatchKey = careerScores[0].key;
  const primaryCareer = careerCatalog[topMatchKey] || careerCatalog.software_engineer;
  
  // Calculate scaled match score between 89% and 97%
  const primaryMatchScore = Math.min(97, Math.max(89, Math.round(careerScores[0].score * 0.96 + 3)));

  // Pick top 2 alternate matches
  const alt1 = careerCatalog[careerScores[1].key];
  const alt2 = careerCatalog[careerScores[2].key];

  const alternativeMatches = [
    {
      title: alt1.title,
      matchScore: Math.min(primaryMatchScore - 4, Math.max(82, Math.round(careerScores[1].score * 0.94))),
      archetype: alt1.archetype,
      salaryRange: alt1.salaryRange,
      reason: `Strong secondary overlap in ${alt1.skills[0]} and ${alt1.skills[1]}.`
    },
    {
      title: alt2.title,
      matchScore: Math.min(primaryMatchScore - 8, Math.max(76, Math.round(careerScores[2].score * 0.91))),
      archetype: alt2.archetype,
      salaryRange: alt2.salaryRange,
      reason: `Solid alignment with your ${alt2.skills[0]} and problem-solving trajectory.`
    }
  ];

  const radarData = [
    { subject: "Logic", A: scores.Logic },
    { subject: "Creativity", A: scores.Creativity },
    { subject: "Communication", A: scores.Communication },
    { subject: "Quantitative", A: scores.Quantitative },
    { subject: "Leadership", A: scores.Leadership },
    { subject: "Resilience", A: scores.Resilience }
  ];

  const roadmapSummaries = primaryCareer.roadmap.map(
    (m) => `${m.title} (${m.duration}): ${m.description}`
  );

  return {
    topMatch: primaryCareer.title,
    matchScore: primaryMatchScore,
    archetype: primaryCareer.archetype,
    summary: primaryCareer.summary,
    salaryRange: primaryCareer.salaryRange,
    marketDemand: primaryCareer.marketDemand,
    skills: primaryCareer.skills,
    growthAreas: primaryCareer.growthAreas,
    roadmap: primaryCareer.roadmap,
    roadmapSummary: roadmapSummaries,
    radarData,
    alternativeMatches,
    evaluatedAt: new Date().toISOString(),
    model: "CareerSathi Intelligent Diagnostic Engine"
  };
}
