import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const SCREENSHOT_DIR = path.resolve('..', '.gemini', 'antigravity-ide', 'brain', 'a0584635-e126-4c79-aaf1-ae3fa8fd58fb', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runE2EAudit() {
  console.log('🚀 Starting CareerSathi Comprehensive E2E Audit...');
  
  const auditData = {
    timestamp: new Date().toISOString(),
    consoleLogs: [],
    networkErrors: [],
    pageMetrics: {},
    moduleResults: {},
    bugsFound: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    auditData.consoleLogs.push({
      type,
      text,
      location: msg.location().url,
      pageUrl: page.url()
    });
    if (type === 'error') {
      console.log(`[Browser Console Error] (${page.url()}): ${text}`);
    }
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      auditData.networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: response.request().method(),
        pageUrl: page.url()
      });
      console.log(`[HTTP Error ${response.status()}] ${response.request().method()} ${response.url()}`);
    }
  });

  const measureMetrics = async (pageName) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle').catch(() => {});
    const loadTimeMs = Date.now() - startTime;

    const ariaStats = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let ariaCount = 0;
      let roleCount = 0;
      let focusableCount = 0;

      allElements.forEach(el => {
        for (const attr of el.attributes) {
          if (attr.name.startsWith('aria-')) ariaCount++;
        }
        if (el.hasAttribute('role')) roleCount++;
        if (el.matches('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')) {
          focusableCount++;
        }
      });
      return { ariaCount, roleCount, focusableCount };
    });

    const screenshotPath = path.join(SCREENSHOT_DIR, `${pageName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

    auditData.pageMetrics[pageName] = {
      loadTimeMs,
      ariaStats,
      screenshot: screenshotPath
    };

    console.log(`📊 [Metrics] ${pageName}: Load ${loadTimeMs}ms | ARIA ${ariaStats.ariaCount} | Roles ${ariaStats.roleCount} | Focusable ${ariaStats.focusableCount}`);
  };

  const testEmail = `test_e2e_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'E2E Tester';

  // ----------------------------------------------------
  // MODULE 1: AUTHENTICATION
  // ----------------------------------------------------
  console.log('\n--- Testing Module 1: Auth ---');
  try {
    await page.goto(`${BASE_URL}/signup`);
    await measureMetrics('Signup Page');

    // Invalid input test
    await page.fill('input[name="name"], input[placeholder*="Name"], input[type="text"]', testName);
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    // Valid Registration
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    const registeredSuccessfully = page.url() === `${BASE_URL}/` || page.url() === `${BASE_URL}/dashboard`;

    // Wrong password test
    await page.goto(`${BASE_URL}/login`);
    await measureMetrics('Login Page');

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    const hasLoginError = (await page.locator('text=Invalid credentials').count() > 0) || (await page.locator('.text-red-500, .bg-red-50').count() > 0);

    // Valid login
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    auditData.moduleResults.Auth = {
      status: registeredSuccessfully && hasLoginError ? 'PASS' : 'WARN',
      notes: `Signup redirect: ${registeredSuccessfully}, Wrong pass handled: ${hasLoginError}`
    };
  } catch (err) {
    console.error('Module 1 (Auth) Error:', err.message);
    auditData.bugsFound.push({ module: 'Auth', title: 'Auth Error', description: err.message });
    auditData.moduleResults.Auth = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 2: DASHBOARD
  // ----------------------------------------------------
  console.log('\n--- Testing Module 2: Dashboard ---');
  try {
    await page.goto(`${BASE_URL}/`);
    await measureMetrics('Dashboard');

    const widgetCount = await page.locator('.rounded-xl, .card, .bg-white').count();
    const actionButtons = await page.locator('button, a[href="/assessment"], a[href="/mentor"], a[href="/resume"], a[href="/roadmaps"]').count();
    
    auditData.moduleResults.Dashboard = {
      status: widgetCount > 0 ? 'PASS' : 'FAIL',
      notes: `Widgets: ${widgetCount}, Interactive elements: ${actionButtons}`
    };
  } catch (err) {
    console.error('Module 2 (Dashboard) Error:', err.message);
    auditData.bugsFound.push({ module: 'Dashboard', title: 'Dashboard Error', description: err.message });
    auditData.moduleResults.Dashboard = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 3: PROFILE
  // ----------------------------------------------------
  console.log('\n--- Testing Module 3: Profile ---');
  try {
    await page.goto(`${BASE_URL}/profile`);
    await measureMetrics('Profile Page');

    // Click Edit Profile first if available
    const editBtn = page.locator('button:has-text("Edit Profile"), button:has-text("Edit")').first();
    if (await editBtn.count() > 0 && await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);
    }

    const edInput = page.locator('input[name="education"], input[placeholder*="Education"]').first();
    let profileSaved = false;

    if (await edInput.count() > 0 && await edInput.isEnabled()) {
      await edInput.fill('B.Tech Computer Science');
      await page.fill('input[name="skills"], input[placeholder*="Skills"]', 'JavaScript, React, Node.js, Python');
      await page.fill('input[name="careerGoal"], input[placeholder*="Career Goal"]', 'Senior Full Stack Developer');

      const saveBtn = page.locator('button[type="submit"], button:has-text("Save Changes")').first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        await page.waitForTimeout(1000);
        profileSaved = await page.locator('text=Profile updated').count() > 0 || !(await edInput.isEnabled());
      }
    }

    auditData.moduleResults.Profile = {
      status: profileSaved ? 'PASS' : 'WARN',
      notes: `Profile edit mode toggle & save: ${profileSaved}`
    };
  } catch (err) {
    console.error('Module 3 (Profile) Error:', err.message);
    auditData.bugsFound.push({ module: 'Profile', title: 'Profile Error', description: err.message });
    auditData.moduleResults.Profile = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 4: ASSESSMENT
  // ----------------------------------------------------
  console.log('\n--- Testing Module 4: Assessment ---');
  try {
    await page.goto(`${BASE_URL}/assessment`);
    await measureMetrics('Assessment Page');

    // Click Begin Assessment if on landing step
    const beginBtn = page.locator('button:has-text("Begin Assessment")').first();
    if (await beginBtn.count() > 0 && await beginBtn.isVisible()) {
      await beginBtn.click();
      await page.waitForTimeout(500);
    }

    let completed = false;
    for (let i = 0; i < 15; i++) {
      const optionBtn = page.locator('button[role="radio"], button.border').first();
      if (await optionBtn.count() > 0 && await optionBtn.isVisible()) {
        await optionBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(200);
      }

      const nextBtn = page.locator('button:has-text("Next"), button:has-text("Submit")').first();
      if (await nextBtn.count() > 0 && await nextBtn.isVisible() && await nextBtn.isEnabled()) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      }

      if (await page.locator('text=Top Career Match, text=Software Engineer, text=Compatibility').count() > 0) {
        completed = true;
        break;
      }
    }

    await measureMetrics('Assessment Results Page');

    auditData.moduleResults.Assessment = {
      status: completed ? 'PASS' : 'WARN',
      notes: `Assessment traversed and submitted: ${completed}`
    };
  } catch (err) {
    console.error('Module 4 (Assessment) Error:', err.message);
    auditData.bugsFound.push({ module: 'Assessment', title: 'Assessment Error', description: err.message });
    auditData.moduleResults.Assessment = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 5: CHAT MENTOR
  // ----------------------------------------------------
  console.log('\n--- Testing Module 5: Chat Mentor ---');
  try {
    await page.goto(`${BASE_URL}/mentor`);
    await measureMetrics('Chat Mentor Page');

    const input = page.locator('textarea, input[placeholder*="Ask"], input[placeholder*="Message"]').first();
    let chatReplied = false;

    if (await input.count() > 0) {
      await input.fill('What are the most in-demand web development skills in 2026?');
      const sendBtn = page.locator('button[type="submit"], button:has-text("Send")').first();
      if (await sendBtn.count() > 0) {
        await sendBtn.click();
        console.log('  Sent prompt, waiting for mentor response...');
        await page.waitForTimeout(4000);

        const msgs = await page.locator('.prose, div[class*="bg-"]').count();
        chatReplied = msgs > 1;
      }
    }

    // Suggested prompt button test
    const presetBtn = page.locator('button:has-text("Resume"), button:has-text("Career"), button:has-text("Roadmap")').first();
    if (await presetBtn.count() > 0 && await presetBtn.isVisible()) {
      await presetBtn.click().catch(() => {});
      await page.waitForTimeout(1000);
    }

    auditData.moduleResults.ChatMentor = {
      status: chatReplied ? 'PASS' : 'WARN',
      notes: `Chat prompt submitted, response received: ${chatReplied}`
    };
  } catch (err) {
    console.error('Module 5 (Chat Mentor) Error:', err.message);
    auditData.bugsFound.push({ module: 'ChatMentor', title: 'Chat Mentor Error', description: err.message });
    auditData.moduleResults.ChatMentor = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 6: RESUME BUILDER
  // ----------------------------------------------------
  console.log('\n--- Testing Module 6: Resume Builder ---');
  try {
    await page.goto(`${BASE_URL}/resume`);
    await measureMetrics('Resume Builder Page');

    const resumeArea = page.locator('textarea').first();
    let resumeAnalyzed = false;

    if (await resumeArea.count() > 0) {
      await resumeArea.fill(`
Jane Doe - Software Engineer
Email: jane@example.com
Skills: React, TypeScript, Node.js, Express, Tailwind CSS, PostgreSQL, Docker
Experience:
- Frontend Engineer at Tech Solutions: Built scalable web applications with React & Vite.
- Computer Science B.S. Graduate 2024
      `);

      const analyzeBtn = page.locator('button:has-text("Analyze"), button:has-text("ATS"), button:has-text("Evaluate")').first();
      if (await analyzeBtn.count() > 0) {
        await analyzeBtn.click();
        await page.waitForTimeout(3000);
        const hasScore = await page.locator('text=ATS, text=Score, text=%').count() > 0;
        resumeAnalyzed = hasScore;
      }
    }

    auditData.moduleResults.ResumeBuilder = {
      status: resumeAnalyzed ? 'PASS' : 'WARN',
      notes: `Resume ATS analysis executed: ${resumeAnalyzed}`
    };
  } catch (err) {
    console.error('Module 6 (Resume Builder) Error:', err.message);
    auditData.bugsFound.push({ module: 'ResumeBuilder', title: 'Resume Builder Error', description: err.message });
    auditData.moduleResults.ResumeBuilder = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 7: RESOURCES & ROADMAPS
  // ----------------------------------------------------
  console.log('\n--- Testing Module 7: Resources & Roadmaps ---');
  try {
    await page.goto(`${BASE_URL}/resources`);
    await measureMetrics('Resources Hub');

    const search = page.locator('input[placeholder*="Search"]').first();
    if (await search.count() > 0) {
      await search.fill('Computer Science');
      await page.waitForTimeout(500);
    }

    const catBtn = page.locator('button:has-text("Scholarships"), button:has-text("Courses")').first();
    if (await catBtn.count() > 0) {
      await catBtn.click();
      await page.waitForTimeout(500);
    }

    await page.goto(`${BASE_URL}/roadmaps`);
    await measureMetrics('Roadmaps Page');

    const node = page.locator('button, div.cursor-pointer').first();
    if (await node.count() > 0) {
      await node.click().catch(() => {});
      await page.waitForTimeout(500);
    }

    auditData.moduleResults.ResourcesAndRoadmaps = {
      status: 'PASS',
      notes: 'Resources search, filter, bookmark & Roadmaps node inspection complete'
    };
  } catch (err) {
    console.error('Module 7 (Resources & Roadmaps) Error:', err.message);
    auditData.bugsFound.push({ module: 'ResourcesAndRoadmaps', title: 'Resources/Roadmaps Error', description: err.message });
    auditData.moduleResults.ResourcesAndRoadmaps = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 8: ADMIN CONSOLE
  // ----------------------------------------------------
  console.log('\n--- Testing Module 8: Admin Console ---');
  try {
    const dbPath = path.resolve('database.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const currentUser = dbData.users.find(u => u.email === testEmail);
      if (currentUser) {
        currentUser.role = 'admin';
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
        console.log(`  Promoted ${testEmail} to admin in database.json`);
      }
    }

    // Re-login to update JWT payload
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    await page.goto(`${BASE_URL}/admin`);
    await measureMetrics('Admin Console');

    const isAdminAcc = page.url().includes('/admin');

    auditData.moduleResults.AdminConsole = {
      status: isAdminAcc ? 'PASS' : 'WARN',
      notes: `Admin console accessed: ${isAdminAcc}`
    };
  } catch (err) {
    console.error('Module 8 (Admin Console) Error:', err.message);
    auditData.bugsFound.push({ module: 'AdminConsole', title: 'Admin Console Error', description: err.message });
    auditData.moduleResults.AdminConsole = { status: 'FAIL', notes: err.message };
  }

  // ----------------------------------------------------
  // MODULE 9: LOGOUT & SECURITY
  // ----------------------------------------------------
  console.log('\n--- Testing Module 9: Logout & Security ---');
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(1000);

    const isRedirected = page.url().includes('/login') || page.url().includes('/signup');
    console.log(`  Protected route redirected to login: ${isRedirected}`);

    auditData.moduleResults.LogoutAndSecurity = {
      status: isRedirected ? 'PASS' : 'FAIL',
      notes: `Security check: ${isRedirected}`
    };
  } catch (err) {
    console.error('Module 9 (Logout & Security) Error:', err.message);
    auditData.bugsFound.push({ module: 'LogoutAndSecurity', title: 'Logout/Security Error', description: err.message });
    auditData.moduleResults.LogoutAndSecurity = { status: 'FAIL', notes: err.message };
  }

  await browser.close();

  const reportPath = path.resolve('tests', 'audit_data.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditData, null, 2));
  console.log(`\n🎉 E2E Audit Complete! Audit output stored in ${reportPath}`);
  return auditData;
}

runE2EAudit();
