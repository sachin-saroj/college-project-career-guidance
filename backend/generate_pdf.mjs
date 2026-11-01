import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>CareerSathi - Project Architecture, Setup & Viva Bible</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 16mm 14mm 18mm 14mm;
    @bottom-right {
      content: counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      color: #64748b;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 10pt;
    background: #ffffff;
  }

  /* Cover & Headers */
  .header-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
    color: #ffffff;
    padding: 24px 28px;
    border-radius: 12px;
    margin-bottom: 22px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
  }

  .header-card h1 {
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
    color: #f8fafc;
  }

  .header-card .subtitle {
    font-size: 11pt;
    color: #cbd5e1;
    font-weight: 400;
    margin-bottom: 14px;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    background: rgba(255, 255, 255, 0.08);
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .meta-item {
    font-size: 9pt;
    color: #e2e8f0;
  }

  .meta-item strong {
    color: #38bdf8;
    display: inline-block;
    min-width: 100px;
  }

  .meta-item a {
    color: #93c5fd;
    text-decoration: none;
    font-weight: 500;
  }

  /* Section Styling */
  .section-title {
    font-size: 14pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 2.5px solid #4f46e5;
    padding-bottom: 6px;
    margin-top: 26px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-title {
    font-size: 11.5pt;
    font-weight: 600;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 10px;
    color: #334155;
  }

  /* Badges & Highlights */
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-primary { background: #e0e7ff; color: #3730a3; }
  .badge-success { background: #dcfce7; color: #166534; }
  .badge-warning { background: #fef3c7; color: #92400e; }
  .badge-danger { background: #fee2e2; color: #991b1b; }

  /* Callouts & Info Boxes */
  .callout {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 12px 0;
    font-size: 9.5pt;
    border-left: 4px solid;
  }

  .callout-info {
    background: #f0fdf4;
    border-color: #22c55e;
    color: #14532d;
  }

  .callout-purple {
    background: #faf5ff;
    border-color: #a855f7;
    color: #581c87;
  }

  .callout-warning {
    background: #fffbeb;
    border-color: #f59e0b;
    color: #78350f;
  }

  /* Code Blocks */
  pre, code {
    font-family: 'JetBrains Mono', monospace;
  }

  code {
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 8.5pt;
    border: 1px solid #e2e8f0;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    margin: 10px 0;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }

  /* Steps list */
  .step-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }

  .step-number {
    display: inline-block;
    background: #4f46e5;
    color: #ffffff;
    width: 22px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    border-radius: 50%;
    font-size: 8.5pt;
    font-weight: 700;
    margin-right: 8px;
  }

  /* Q&A Cards */
  .qa-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 14px;
    page-break-inside: avoid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .qa-card.tech {
    border-left: 4px solid #0284c7;
  }

  .qa-card.project {
    border-left: 4px solid #6366f1;
  }

  .qa-question {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .qa-question .q-tag {
    font-size: 8pt;
    padding: 2px 6px;
    border-radius: 4px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
  }

  .qa-answer {
    font-size: 9.5pt;
    color: #334155;
    line-height: 1.55;
  }

  .qa-answer strong {
    color: #0f172a;
  }

  .qa-answer ul {
    margin-left: 18px;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .qa-answer li {
    margin-bottom: 4px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 9pt;
  }

  th, td {
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

  <!-- COVER HEADER -->
  <div class="header-card">
    <h1>🎓 CareerSathi (करियर साथी)</h1>
    <div class="subtitle">Complete Technical Architecture, Laptop Setup Manual & Comprehensive Viva/Interview Bible</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>GitHub Repo:</strong> <a href="https://github.com/sachin-saroj/college-project-career-guidance">github.com/sachin-saroj/college-project-career-guidance</a></div>
      <div class="meta-item"><strong>Live URL:</strong> <a href="https://college-project-career-guidance.onrender.com">college-project-career-guidance.onrender.com</a></div>
      <div class="meta-item"><strong>API Swagger Docs:</strong> <a href="https://college-project-career-guidance.onrender.com/api/docs/">college-project-career-guidance.onrender.com/api/docs</a></div>
      <div class="meta-item"><strong>Database Engine:</strong> SQLite + Drizzle ORM (Zero-Setup Embedded DB)</div>
    </div>
  </div>

  <!-- SECTION 1: SYSTEM OVERVIEW & ARCHITECTURE -->
  <h2 class="section-title">🏗️ 1. Project Overview & Complete Architecture</h2>
  <p><strong>CareerSathi</strong> ek AI-powered, full-stack career guidance and mentorship portal hai jise khas taur par underprivileged aur underrepresented students ke career gap ko bridge karne ke liye build kiya gaya hai.</p>

  <table>
    <tr>
      <th style="width: 22%;">Layer</th>
      <th style="width: 38%;">Technology Stack</th>
      <th style="width: 40%;">Core Responsibility</th>
    </tr>
    <tr>
      <td><strong>Frontend SPA</strong></td>
      <td>React 19, TypeScript, Vite 6, Tailwind CSS, Zustand, Framer Motion</td>
      <td>Modern high-performance reactive UI, state management, client routing, PDF generation, animated transitions.</td>
    </tr>
    <tr>
      <td><strong>Backend API</strong></td>
      <td>Node.js 20+, Express.js 4.x (ES Modules), Zod, Multer, pdf-parse</td>
      <td>RESTful API endpoints, request validation, JWT auth, resume file parsing, rate limiting, and CORS security.</td>
    </tr>
    <tr>
      <td><strong>AI Intelligence</strong></td>
      <td>Google Gemini 1.5 Flash SDK (<code>@google/generative-ai</code>)</td>
      <td>Real-time personalized career mentorship chat, dynamic roadmap generation, ATS resume scoring.</td>
    </tr>
    <tr>
      <td><strong>Database & ORM</strong></td>
      <td>SQLite (<code>better-sqlite3</code>) + <strong>Drizzle ORM</strong> (<code>drizzle-orm</code>, <code>drizzle-kit</code>)</td>
      <td>Embedded relational database, WAL mode concurrency, atomic ACID transactions, zero external server dependency.</td>
    </tr>
  </table>

  <!-- SECTION 2: DATABASE & DRIZZLE STUDIO DEEP-DIVE -->
  <h2 class="section-title">💾 2. Database Deep-Dive: Kaha Save Hota Hai aur Kaise?</h2>
  <div class="callout callout-info">
    <strong>💡 Key Viva Point:</strong> Project mein koi external paid database service (MongoDB Atlas, Supabase, Neon) nahi chahiye. SQLite database file project ke andar hi run hoti hai aur Drizzle ORM use manage karta hai.
  </div>

  <div class="step-box">
    <div class="sub-title">📂 Database Ka Physical Location & Lifecycle</div>
    <ul>
      <li><strong>Database File:</strong> <code>backend/database.sqlite</code> (Jab project start hota hai toh yeh file automatically create ho jati hai).</li>
      <li><strong>Schema Definitions:</strong> <code>backend/db/schema.js</code> mein <code>users</code> aur <code>resources</code> tables define hain.</li>
      <li><strong>Connection & Auto-Seed:</strong> <code>backend/db/index.js</code> mein database initialize hoti hai, <code>PRAGMA journal_mode = WAL</code> enable hota hai, aur agar DB blank ho toh automatically default resources aur test users seed ho jate hain.</li>
      <li><strong>Unified Data Access:</strong> <code>backend/db.js</code> function-level abstraction deta hai (<code>getUsers()</code>, <code>saveUsers()</code>) jo Drizzle ke saath atomic transactions run karta hai.</li>
    </ul>
  </div>

  <div class="step-box">
    <div class="sub-title">🔄 Data Save Hone Ka Exact Flow (Write Request Lifecycle)</div>
    <p>1. Student frontend par register ya profile update karta hai (e.g., Assessment submit karta hai).<br>
    2. Request HTTP POST bankar Express route (<code>backend/routes.js</code>) par aati hai.<br>
    3. Zod middleware data validation check karta hai. Auth token verify hota hai.<br>
    4. <code>saveUsers()</code> call hota hai jo SQLite mein <strong>Atomic Transaction</strong> run karta hai:<br>
    <code>db.insert(users).values(...).onConflictDoUpdate(...)</code><br>
    5. Data SQLite file (<code>database.sqlite</code>) mein instant commit ho jata hai. WAL (Write-Ahead Logging) hone ki wajah se concurrent writes pe database lock ya crash nahi hota.</p>
  </div>

  <div class="step-box">
    <div class="sub-title">🖥️ Drizzle Studio: Live Database Visual GUI</div>
    <p>Drizzle ORM ke sath <strong>Drizzle Studio</strong> included hai. Isse project ka live database visually browser mein table aur rows ke roop mein inspect kiya ja sakta hai:</p>
    <pre><code># Terminal mein run karo:
npm run db:studio

# Yeh browser mein live visual GUI open kar dega:
# https://local.drizzle.studio
# Jahan tum users, assessment scores, bookmarks, passwords dekh aur live edit kar sakte ho!</code></pre>
  </div>

  <!-- SECTION 3: DOST KE LAPTOP PAR SETUP GUIDE -->
  <div class="page-break"></div>
  <h2 class="section-title">💻 3. Dost Ke Laptop Par Setup Karne Ka Step-by-Step Guide</h2>
  <p>Agar kisi dost, examiner, ya college lab ke laptop par yeh project chalana hai, toh bas yeh 5 simple steps follow karo:</p>

  <div class="step-box">
    <div class="sub-title"><span class="step-number">1</span> Prerequisites (Pehle Yeh Install Hona Chahiye)</div>
    <ul>
      <li><strong>Node.js</strong>: Version 18 ya usse upar (Download: <code>nodejs.org</code>). Check karne ke liye: <code>node -v</code></li>
      <li><strong>Git</strong>: Version control tool (Download: <code>git-scm.com</code>). Check: <code>git -v</code></li>
      <li><strong>VS Code</strong>: Recommended code editor.</li>
    </ul>
  </div>

  <div class="step-box">
    <div class="sub-title"><span class="step-number">2</span> GitHub Se Clone Karo</div>
    <pre><code># Terminal / PowerShell open karo aur run karo:
git clone https://github.com/sachin-saroj/college-project-career-guidance.git
cd college-project-career-guidance</code></pre>
  </div>

  <div class="step-box">
    <div class="sub-title"><span class="step-number">3</span> Ek Command Mein Dependencies Install Karo</div>
    <pre><code># Root folder se yeh chalao (yeh backend aur frontend dono install karega):
npm run install:all</code></pre>
  </div>

  <div class="step-box">
    <div class="sub-title"><span class="step-number">4</span> Environment Variables Setup Karo (.env)</div>
    <p><code>backend</code> folder mein ek <code>.env</code> file banao (ya <code>.env.example</code> copy karo):</p>
    <pre><code>PORT=5000
JWT_SECRET=super_secret_jwt_key_careersathi_2026
GEMINI_API_KEY=your_gemini_api_key_here
SQLITE_DB_PATH=database.sqlite</code></pre>
    <p style="font-size: 8.5pt; color: #64748b;"><em>Note: Agar Gemini API key nahi bhi daalte, toh assessment engine aur auth bina kisi issue ke high-precision fallback deterministic engine se chalte hain.</em></p>
  </div>

  <div class="step-box">
    <div class="sub-title"><span class="step-number">5</span> Project Run Karo (Development Mode)</div>
    <p>Do separate terminal open karo:</p>
    <pre><code># Terminal 1 (Backend API + SQLite):
cd backend
npm run dev

# Terminal 2 (Frontend React 19 UI):
cd frontend-v2
npm run dev</code></pre>
    <p>👉 Ab browser mein <strong>http://localhost:5173</strong> open karo! Pura project live run karega aur database auto-seed ho jayega!</p>
  </div>

  <!-- SECTION 4: 15 DEEP PROJECT VIVA QUESTIONS -->
  <div class="page-break"></div>
  <h2 class="section-title">🎯 4. Project-Specific Viva Questions (15 Deep & Practical Q&A)</h2>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q1</span> CareerSathi project ka main objective aur problem statement kya hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> India mein tier-2, tier-3 aur rural colleges ke lakho students ke paas personalized career counselling ya industry mentors ki access nahi hoti. Career counselling services bohot expensive hoti hain. <strong>CareerSathi</strong> ek zero-cost, accessible web platform hai jo AI aur psychometric diagnostic testing ke zariye students ko unki actual cognitive skills, personality aur interests ke hisab se exact career roadmap, free scholarships, internships aur AI resume review provide karta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q2</span> Project ka High-Level Architecture kaise design kiya gaya hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Architecture 3-Tier Layered Pattern follow karta hai:
      <ul>
        <li><strong>Client Layer:</strong> React 19 SPA jo client-side state (Zustand) aur routing manage karta hai.</li>
        <li><strong>Server Layer:</strong> Express.js REST API jo JWT auth, Zod input validation, rate limiting aur Gemini AI SDK context injection handle karta hai.</li>
        <li><strong>Persistence Layer:</strong> Embedded SQLite database jise Drizzle ORM manage karta hai with WAL (Write-Ahead Logging) mode.</li>
      </ul>
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q3</span> Frontend ke liye React 19, TypeScript aur Vite kyu select kiya?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> React 19 latest stable component architecture deta hai with superior performance. TypeScript pure codebase mein strict compile-time type safety deta hai jisse runtime bugs khatam hote hain. Vite ES Modules use karta hai, jisse cold start 300ms ke andar hota hai aur HMR (Hot Module Replacement) instant re-render karta hai jo legacy Webpack ke comparison mein 10x fast hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q4</span> Assessment Engine (Psychometric Career Test) kaise kaam karta hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Assessment Engine 10 multi-dimensional diagnostic questions poochhta hai jo student ke 6 core pillars score karte hain: <em>Logic, Creativity, Communication, Quantitative, Leadership, Resilience</em>. Answers ke weighted scores calculate hote hain aur archetype identify hota hai (e.g., <em>The Analytical Systems Architect</em>). Uske basis par personalized Radar Chart, Match Score (e.g., 92%), 5-Stage step-by-step Roadmap, salary range aur market demand live generate hoti hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q5</span> Google Gemini 1.5 Flash AI integration kaise kaam karta hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Backend mein <code>@google/generative-ai</code> SDK use kiya hai. Jab student AI Mentor se chat karta hai, toh backend user ka context (education, skills, assessment result, resume text) prompt ke sath inject karta hai. Is prompt engineering ki wajah se Gemini generic advice dene ke bajay specific aur personalized career advice deta hai. Agar AI API limit exceed ho ya offline ho, toh fallback deterministic engine transparently handle karta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q6</span> Authentication aur Authorization security kaise implement ki hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Stateless <strong>JWT (JSON Web Token)</strong> authentication use kiya hai. User jab register ya login karta hai, password <code>bcryptjs</code> se 10 salt rounds ke sath hash hokar SQLite mein store hota hai. Login hone par backend 7-day validity ka signed JWT token deta hai. Protected routes par <code>auth</code> middleware token verify karta hai, aur admin endpoints par Role-Based Access Control (RBAC) middleware check karta hai ki user ka role <code>admin</code> hai ya nahi.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q7</span> Project mein Database ke liye SQLite + Drizzle ORM kyu choose kiya?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Do main reasons hain:
      <ul>
        <li><strong>Zero Deployment Friction:</strong> Kisi external cloud database par depend nahi rehna padta. College submission ya demo ke waqt <code>npm run dev</code> chalate hi project instantly ready ho jata hai.</li>
        <li><strong>ACID Reliability:</strong> Drizzle ORM clean, modern type-safe schema deta hai. SQLite WAL mode mein chalta hai, jo high read/write concurrency support karta hai aur data kabhi corrupt nahi hota.</li>
      </ul>
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q8</span> SQLite database ka data kahan save hota hai aur structure kya hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Data <code>backend/database.sqlite</code> file mein store hota hai. Isme do core tables hain:
      <ul>
        <li><code>users</code>: User ID, name, email, role, password_hash, education, skills, assessment scores, resume JSON, bookmarked resources.</li>
        <li><code>resources</code>: ID, title, description, category, provider, skills, difficulty, url, isFree.</li>
      </ul>
      Drizzle ORM JSON fields ko directly serialize aur deserialize kar leta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q9</span> Drizzle Studio kya hai aur iska kya fayda hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Drizzle Studio Drizzle ORM ka built-in graphical dashboard hai. <code>npm run db:studio</code> run karne par local web interface khulta hai jahan developer ya examiner ko bina kisi third-party software (jaise DBeaver ya pgAdmin) ke pure SQLite database ke tables, records aur live edits visually dikh jate hain.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q10</span> Render par deploy karne par project kaise behave karta hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Render par root <code>package.json</code> ka build script run hota hai jo backend aur frontend dono build karta hai. Express server production mein <code>frontend-v2/dist</code> ko static serve karta hai. Jab instance start hota hai, SQLite auto-table creation aur auto-seed check execute hota hai, jisse clean zero-downtime startup milta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q11</span> Resume Analyzer aur ATS Score Reviewer kaise kaam karta hai?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Student jab PDF resume upload karta hai, backend mein <code>multer</code> memory storage mein file receive karta hai aur <code>pdf-parse</code> library raw text extract karti hai. Is extracted text ko analyze kiya jata hai keywords, action verbs, quantitative metrics aur skills ke basis par aur 0 to 100 ka ATS Score aur improvement suggestions generate hoti hain.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q12</span> Backend API security ke liye kya measures implement kiye hain?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> 5 major security layers hain:
      <ul>
        <li><strong>Input Validation:</strong> Zod schema validation har payload ko sanitize aur type-check karti hai.</li>
        <li><strong>Rate Limiting:</strong> <code>express-rate-limit</code> auth endpoints par brute-force attack rokta hai.</li>
        <li><strong>CORS Policy:</strong> Restricted origin access taaki unauthorized domains API call na kar sakein.</li>
        <li><strong>Reverse Proxy IP Trust:</strong> <code>app.set('trust proxy', 1)</code> for Render/Cloudflare IP identification.</li>
        <li><strong>Environment Isolation:</strong> Secrets strictly <code>.env</code> mein rehte hain, code mein hardcode nahi hote.</li>
      </ul>
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q13</span> Admin Dashboard ke paas kya-kya powers hain?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Admin dashboard par total registered students, completed assessments, aur active resources ke live metrics dikhte hain. Admin naye courses/scholarships add, update aur delete kar sakta hai, kisi bhi student ka role change ya account remove kar sakta hai, aur pure database ka JSON backup export ya import kar sakta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q14</span> Frontend mein State Management ke liye Zustand kyu choose kiya Redux ke bajay?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Redux mein bohot zyada boilerplate code (actions, reducers, dispatchers, action types) hota hai. Zustand ek modern, lightweight (1.2KB) hook-based state management library hai. Isme direct state mutators likh sakte hain aur component sirf required state subscribe karke re-render minimize karta hai.
    </div>
  </div>

  <div class="qa-card project">
    <div class="qa-question"><span class="q-tag">Q15</span> Agar is project ko 50,000 active students ke liye scale karna ho toh kya architecture changes karoge?</div>
    <div class="qa-answer">
      <strong>Answer:</strong> Production scale ke liye:
      1. Embedded SQLite ko Hosted PostgreSQL (Amazon RDS ya Supabase) mein migrate karenge with connection pooling (PgBouncer).<br>
      2. AI responses aur session caching ke liye Redis layer lagayenge.<br>
      3. Resume processing ko background message queue (BullMQ / RabbitMQ) par shift karenge.<br>
      4. Media/Resume PDFs ko S3 bucket par store karenge.
    </div>
  </div>

  <!-- SECTION 5: 20 TECH STACK VIVA QUESTIONS -->
  <div class="page-break"></div>
  <h2 class="section-title">💡 5. Core Tech Stack Viva Questions (20 Fundamental Q&A)</h2>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T1</span> Backend kya hota hai aur iska main responsibility kya hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Backend kisi web application ka "brain" hota hai jo server-side run hota hai. Iska kaam business logic execute karna, database ke sath data read/write karna, authentication aur security verify karna, aur frontend ko REST ya GraphQL API ke zariye structured JSON data supply karna hota hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T2</span> Frontend kya hota hai aur Single Page Application (SPA) traditional website se kaise alag hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Frontend user interface (UI) hota hai jo browser mein render hota hai. Traditional multi-page applications (MPA) mein har click par server pura naya HTML page bhejta hai jisse screen reload hoti hai. SPA (React) mein ek hi HTML load hota hai aur route change hone par sirf required data fetch karke DOM dynamically update hota hai bina page reload kiye.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T3</span> Database kya hota hai aur Relational (SQL) vs NoSQL mein difference kya hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Database structured data storage system hai. <strong>SQL (Relational):</strong> Data predefined schemas ke sath tables (rows/columns) mein store hota hai with foreign keys aur ACID guarantees (e.g., PostgreSQL, SQLite, MySQL). <strong>NoSQL:</strong> Flexible schemas use karta hai jaise JSON documents ya key-value pairs (e.g., MongoDB, Redis).</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T4</span> SQLite kya hai aur yeh MySQL ya PostgreSQL se kaise alag hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> SQLite ek <strong>embedded, serverless</strong> relational database engine hai. Iske liye koi alag background process ya database server run nahi karna padta; pura database ek single disk file hota hai. MySQL aur PostgreSQL client-server databases hain jo alag server process par run hote hain aur TCP/IP port par network calls listen karte hain.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T5</span> ORM (Object-Relational Mapping) kya hota hai aur iska use kyu karte hain?</div>
    <div class="qa-answer"><strong>Answer:</strong> ORM ek programming technique hai jo code ke objects aur database tables ke beech mapping banata hai. Isse developers ko raw SQL strings (<code>SELECT * FROM users WHERE...</code>) likhne ke bajay programming language ki native syntax mein type-safe queries likhne ki suvidha milti hai, jisse SQL Injection attacks automatically prevent hote hain.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T6</span> Drizzle ORM kya hai aur yeh Prisma se kaise better/alag hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Drizzle ORM ek ultra-lightweight, zero-overhead TypeScript ORM hai jo SQL-like syntax follow karta hai. Prisma mein ek heavy Rust binary engine background mein chalta hai jo bundle size aur cold starts badha deta hai. Drizzle pure JavaScript/TypeScript mein chalta hai, serverless/edge ready hai, aur SQL queries par complete transparency aur high performance deta hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T7</span> Express.js vs FastAPI mein kya antar hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> <strong>Express.js:</strong> Node.js (JavaScript) ka minimal, highly flexible web framework hai jo async event-loop use karta hai aur JavaScript ecosystem ke sath seamlessly integrate hota hai. <strong>FastAPI:</strong> Python framework hai jo type hints aur Pydantic use karta hai aur automatic Swagger generation deta hai. Data science aur Python ML models ke sath FastAPI popular hai, jabki full-stack JavaScript teams Express prefer karti hain.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T8</span> REST API kya hota hai aur HTTP Methods (GET, POST, PUT, DELETE) ka kya kaam hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> REST (Representational State Transfer) ek architectural style hai jo standard HTTP methods use karke resources manipulate karta hai:
      <ul>
        <li><code>GET</code>: Data retrieve/read karne ke liye (safe & idempotent).</li>
        <li><code>POST</code>: Naya resource create karne ke liye.</li>
        <li><code>PUT / PATCH</code>: Existing resource ko complete ya partial update karne ke liye.</li>
        <li><code>DELETE</code>: Resource ko remove karne ke liye.</li>
      </ul>
    </div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T9</span> JWT (JSON Web Token) kya hota hai aur iske 3 parts kya hain?</div>
    <div class="qa-answer"><strong>Answer:</strong> JWT ek compact, URL-safe standard hai jo client aur server ke beech claims securely transfer karta hai. Yeh teen parts se milkar banta hai separated by dots (<code>header.payload.signature</code>):
      <ul>
        <li><strong>Header:</strong> Algorithm aur token type define karta hai (e.g., HS256).</li>
        <li><strong>Payload:</strong> Claims jaise userId, role, expiry time store karta hai.</li>
        <li><strong>Signature:</strong> Server ke secret key se cryptographically hash hota hai taaki token tampered na ho sake.</li>
      </ul>
    </div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T10</span> CORS (Cross-Origin Resource Sharing) kya hota hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> CORS ek browser security mechanism hai jo rokta hai ki ek origin (domain/port) par chalne wali web application kisi doosre origin ke resources ko unauthorized access na kare. Agar frontend <code>localhost:5173</code> par hai aur backend <code>localhost:5000</code> par, toh backend ko explicit CORS headers (e.g. <code>Access-Control-Allow-Origin</code>) return karne padte hain.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T11</span> Zod kya hai aur schema validation kyu critical hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Zod ek TypeScript-first schema declaration aur validation library hai. Jab client request bhejta hai, toh malicious ya invalid data (jaise galat email format ya chhota password) server tak pahunch sakta hai. Zod payload ko check karta hai aur invalid input par 400 Bad Request return karta hai, jisse database corrupt hone se bach jata hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T12</span> Password Hashing kya hoti hai aur Plaintext kyu store nahi karte?</div>
    <div class="qa-answer"><strong>Answer:</strong> Hashing ek one-way cryptographic function hai jisse original password ko unreadable hash mein convert kiya jata hai jise reverse engineer nahi kiya ja sakta. <code>bcryptjs</code> random "Salt" add karta hai aur 10 cost factor use karta hai. Isse database leak hone par bhi attacker rainbow tables ya brute force se password read nahi kar sakta.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T13</span> Rate Limiting kya hai aur iska kya fayda hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Rate Limiting kisi specific IP address se aane wali requests ki sankhya ko ek fixed time window mein restrict karti hai (e.g., 15 minute mein maximum 60 login attempts). Yeh Denial-of-Service (DoS) aur password dictionary/brute-force attacks ko block karti hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T14</span> Vite kya hai aur traditional Webpack se yeh fast kyu hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Webpack development ke waqt pure application ko bundle karta hai jisme bade projects par kaafi waqt lagta hai. Vite native browser <strong>ES Modules (ESM)</strong> use karta hai, jisse source code ko bundle karne ki zaroorat nahi padti. Sirf wahi file compile hoti hai jo browser request karta hai, jisse development server milliseconds mein start hota hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T15</span> State Management kya hai aur Zustand Redux se kyu lightweight hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> State Management application ke shared data (jaise logged-in user profile, theme, auth token) ko globally manage karta hai taaki deeply nested components mein prop drilling na karni pade. Zustand sirf 1.2KB ka hai, bina context providers ke direct hooks deta hai, aur Redux ke boilerplate actions/reducers ko eliminate karta hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T16</span> Tailwind CSS traditional CSS se kaise different hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Traditional CSS mein har element ke liye custom class aur CSS file banani padti hai. Tailwind ek <strong>utility-first CSS framework</strong> hai jo pre-built utility classes (e.g., <code>flex</code>, <code>p-4</code>, <code>rounded-lg</code>, <code>text-blue-600</code>) provide karta hai. Isse directly JSX ke andar consistent, responsive styling fast ho jati hai aur production build mein unused CSS purge ho jati hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T17</span> Write-Ahead Logging (WAL) mode SQLite mein kya karta hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> Traditional SQLite mein write operation ke dauran pura database lock ho jata tha, jisse readers block hote the. WAL mode (<code>PRAGMA journal_mode = WAL</code>) mein changes pehle ek separate <code>.wal</code> file mein append hote hain. Isse <strong>readers writers ko block nahi karte aur writers readers ko block nahi karte</strong>, jisse application concurrency dramatically improve ho jati hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T18</span> Prompt Engineering aur Context Injection kya hota hai?</div>
    <div class="qa-answer"><strong>Answer:</strong> LLM (Large Language Model) ko sirf user ka sawal bhejne par generic jawab milta hai. <strong>Context Injection</strong> mein application backend student ki profile details (skills, education, test score) ko background system prompt ke sath merge karke model ko deta hai. Isse AI ko exact pata hota hai ki woh kisse baat kar raha hai aur accurate tailored response generate karta hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T19</span> Reverse Proxy kya hota hai aur <code>app.set('trust proxy', 1)</code> kyu lagate hain?</div>
    <div class="qa-answer"><strong>Answer:</strong> Reverse Proxy (jaise Cloudflare, Nginx, ya Render load balancer) client aur backend server ke beech baithta hai aur SSL termination, caching aur DDoS protection karta hai. Kyunki request pehle proxy ke paas aati hai, Express ko client ka real IP nahi milta. <code>trust proxy</code> enable karne par Express proxy ke <code>X-Forwarded-For</code> header ko trust karke real client IP rate limiter ko supply karta hai.</div>
  </div>

  <div class="qa-card tech">
    <div class="qa-question"><span class="q-tag">T20</span> Environment Variables (.env) kyu mandatory hote hain?</div>
    <div class="qa-answer"><strong>Answer:</strong> Secret keys (JWT_SECRET, GEMINI_API_KEY, database passwords) ko source code mein hardcode karne se security vulnerability hoti hai, kyunki code GitHub par public ho sakta hai. Environment variables secrets ko codebase se isolate karte hain, aur alag-alag environments (development, staging, production) ke liye different configurations allow karte hain.</div>
  </div>

</body>
</html>
`;

async function generatePDF() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  
  const outputPath = path.resolve(__dirname, '../CareerSathi_Complete_Project_Viva_Guide.pdf');
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm'
    }
  });
  
  await browser.close();
  console.log('PDF Successfully Generated at:', outputPath);
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
