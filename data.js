// --- CASE DATABASE ---
const portfolioCases = [
    {   
        logoUrl:"assets/logos/holofante/logo.jpeg",
        id: "case-01",
        year: "2026 ∙ Holofante lab",
        title: "Agentic AI Design",
        repositoryUrl: "https://github.com/schimanko/holofante", 
        liveUrl: "https://holofante.vercel.app",
        desc: `
         <p class="p1">
            <strong>
               Context:
            </strong>
            As a solo founder of an Applied lab, I needed to transform a "handcrafted"
            consulting operation into a scalable system, connecting proposals, contracts,
            billing, and delivery tracking into a single product experience.
         </p>
         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">
                     18 ➔ 5.3 days
               </span>
               <span class="metric-label">
                     Time from accepted budget to first deliverable
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     10h+
               </span>
               <span class="metric-label">
                     Weekly hours recovered via Q2C automation
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     100%
               </span>
               <span class="metric-label">
                     UI Consistency via DesignOps Framework
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     < 2s</span>
                        <span class="metric-label">
                           Latency in state-oriented UI
                        </span>
            </div>
         </div>
         <h3>
            Business Challenge
         </h3>
         <p class="p1">
            <strong>
               Core Problem:
            </strong>
            Inability to scale revenue without hiring an administrative team, compromising
            profit margins and operational agility.
         </p>
         <p class="p1">
            <strong>
               Constraints:
            </strong>
            <br>
            - Zero budget for hiring — all solutions built internally
            <br>
            - Development parallel to serving paying clients
            <br>
            - Limited to the native ecosystem (JavaScript) based on existing client
            base
            <br>
            - Compliance: CDC, ISS/RPS for electronic invoices, LGPD
         </p>
         <p class="p1">
            <strong>
               Measurable Objectives:
            </strong>
            <br>
            - Reduce manual work by 27%+ and recover 10h+ weekly
            <br>
            - Ensure 100% UI consistency across 8+ project milestones
            <br>
            - Increase CTR via event-driven notifications
         </p>
         <p class="p1">
            <strong>
               Project Members:
            </strong>
            Lio Schimanko
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/2.avif" alt="Full sales flow from lead to post-sales">
            </div>
            <p class="case-caption">
               Customer Life Cycle — 7 stages with various automation points.
            </p>
         </div>
         <h3>
            Research & Discovery
         </h3>
         <p class="p1">
            <strong>
               Methods Used:
            </strong>
            <br>
            - Quantitative analysis: 6 months of data via Toggl Track (127 hours mapped)
            <br>
            - 8 semi-structured interviews with clients regarding sales process friction
            <br>
            - Benchmarking of 12 SaaS tools (Proposify, PandaDoc, Dubsado, HoneyBook)
            <br>
            - Mapping of 23 touchpoints in the commercial cycle
         </p>
         <p class="p1">
            <strong>
               Design & Operations Stack:
            </strong>
            Figma, DesignOps (Multi-state components), Notion (Source of Truth / Relational
            CRM)
            <br>
            <strong>
               Engineering & AI:
            </strong>
            Node.js (Serverless), LangChain, OpenAI (Agentic Framework), PWA
            <br>
            <strong>
               Ecosystem & Data:
            </strong>
            API Integration (Asaas, Clicksign), Encryption (crypto.js), Webhooks
         </p>
         <p class="p1">
            <strong>
               Key Insights:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Invisible Bottleneck:
            </strong>
            Clients waited an average of 4.2 days between interest and a formal proposal
            — 68% cited "delay in response" as an initial frustration.
         </p>
         <p class="p1">
            <strong>
               2. Documentation as a Differentiator:
            </strong>
            100% valued documentation (requirements, prototypes, manuals), but 75%
            reported difficulty in tracking status.
         </p>
         <p class="p1">
            <strong>
               3. Pricing Transparency:
            </strong>
            Budgets with detailed calculations converted 2.3x more than "black box"
            quotes. Clients wanted to understand
            <em>
               why
            </em>
            a certain value was set.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/3.avif" alt="Notion CRM with budgets and automations">
            </div>
            <p class="case-caption">
               Notion as the Source of Truth — budgets, contracts, and status centralized.
            </p>
         </div>
         <h3>
            Design Process & Critical Decisions
         </h3>
         <p class="p1">
            <strong>
               Critical Decision #1: DesignOps Framework vs. Ad-Hoc Components
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Ad-hoc components per project
            </strong>
            <br>
            Pro: Initial speed, no documentation overhead
            <br>
            Con: Visual inconsistency, rework, difficult to scale
         </p>
         <p class="p1">
            <strong>
               Option B: DesignOps Framework with multi-state library
            </strong>
            <br>
            Pro: Guaranteed consistency, reusability, living documentation
            <br>
            Con: High initial investment, learning curve
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Full DesignOps Framework
            <br>
            <strong>
               Reason:
            </strong>
            With 8+ project milestones (Budget → Requirements → Prototype → Manual
            → Transfer → Warranty), each state needs specific UI. The multi-state component
            library covered "Hibernate" (paused project), "Action Required" (client
            needs to act), and "Fallback" (error/offline).
            <br>
            <strong>
               Impact:
            </strong>
            100% UI consistency across all milestones. Development time for new features
            dropped by 60% due to reusable documented components. The client perceives
            a cohesive system, not a "patchwork quilt."
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-typescript">
export type MilestoneState = "Requirements" | "Prototype" | "Manual" | "Final";
export interface ProjectState {
  currentMilestone: MilestoneState;
  requirementsStatus: "pending" | "approved";
  prototypeStatus: "not_started" | "pending" | "approved";
  manualStatus: "not_started" | "pending" | "approved";
  actionRequiredText: string | null;
}</code>
               </pre>
            </div>
            <p class="case-caption">
               DesignOps Schema Data Models managing Finite State Automata modeling rules
               across active milestones.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #2: Static Rendering vs. State-Oriented Conditional
               Rendering
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Static pages per status (8 separate screens)
            </strong>
            <br>
            Pro: Simple architecture, no complex logic
            <br>
            Con: Explosive maintenance, 8x duplicate code, confusing navigation
         </p>
         <p class="p1">
            <strong>
               Option B: Conditional rendering based on backend states
            </strong>
            <br>
            Pro: Single source of truth, UI reacts automatically to changes
            <br>
            Con: High logical complexity, difficult debugging
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Data-driven conditional rendering
            <br>
            <strong>
               Reason:
            </strong>
            Each project has a complex backend state (Status: "Requested" / "Confirmed"
            / "Closed", Delivery: "Sent" / "Approved", Ownership: "Pending" / "Signed").
            The UI needed to reflect combinations of these variables dynamically. The
            system detects the state → renders specific component → displays contextual
            action.
            <br>
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/sketch.avif" alt="Initial sketch of the conditional rendering idea">
            </div>
            <p class="case-caption">
               Initial sketch of the conditional rendering idea.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #3: Public Data Governance vs. UUID Framework with Encryption
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Sensitive data in public tables (simple URLs)
            </strong>
            <br>
            Pro: Trivial implementation, zero technical overhead
            <br>
            Con: LGPD exposure, values visible to crawlers, reputational risk
         </p>
         <p class="p1">
            <strong>
               Option B: UUID Framework + encryption decoupling public layers
            </strong>
            <br>
            Pro: Guaranteed privacy, LGPD compliance, scalability
            <br>
            Con: Architectural complexity, processing overhead
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            UUID as unique identifier + crypto.js for shielding
            <br>
            <strong>
               Reason:
            </strong>
            Budgets contain sensitive data (values, company size, multipliers). Public
            URLs (/proposals/[uuid]) cannot expose values in indexable tables. The
            system generates a unique UUID per budget, encrypts sensitive fields (APITotalAvista,
            APITotalParcelado, etc.) before sending to the database, and decrypts only
            on the client frontend.
            <br>
            <strong>
               Impact:
            </strong>
            Zero data leaks in 12 months of operation. Semi-public CMS tables display
            "0" where "R$ 50,000" should appear — protection against scraping. The
            client sees a transparent breakdown (conversion +97%), but data is shielded
            from third parties. LGPD compliance guaranteed.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-javascript">
const CryptoJS = require("crypto-js");
const encryptBudgetData = (data, secureKey) = >{
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secureKey).toString();
  return {
    id: crypto.randomUUID(),
    payload: ciphertext
  };
};</code></pre>
            </div>
            <p class="case-caption">
               Decoupled data payload model using deterministic UUID matrices and payload
               encryption strategies via crypto.js.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #4: Generic Notifications vs. Event-Driven Nodes
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Generic notifications per milestone ("Project updated")
            </strong>
            <br>
            Pro: Simple to implement, zero conditional logic
            <br>
            Con: Cognitive noise, low CTR, notification fatigue
         </p>
         <p class="p1">
            <strong>
               Option B: Event-driven communication nodes with behavioral triggers
            </strong>
            <br>
            Pro: Contextual, high relevance, superior CTR
            <br>
            Con: Complex event mapping, burdensome maintenance
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Behavior-oriented multi-channel system
            <br>
            <strong>
               Reason:
            </strong>
            Each backend action (signed contract, approved requirements, confirmed
            payment) triggers a specific event → system identifies event type → selects
            channel (push notification + transactional email) → personalizes message
            with contextual data (client name, next action). 17 flows mapped covering
            the full journey.
            <br>
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/4.avif" alt="Dynamic budget with detailed breakdown.">
            </div>
            <p class="case-caption">
               Description: A desktop web browser screenshot displaying a digital service
               proposal page from holofante.com.br. Titled "Orçamento para Website, App
               móvel", the page features project pricing, payment structures, and an expandable
               list detailing included features like main and secondary pages.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #5: Manual Automation vs. Agentic Framework
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Manual flows (collaborator triggers each stage)
            </strong>
            <br>
            Pro: Total control, no risk of wrong automation
            <br>
            Con: Does not scale, human error, operational bottleneck
         </p>
         <p class="p1">
            <strong>
               Option B: Agentic framework orchestrating milestones automatically
            </strong>
            <br>
            Pro: Infinite scalability, zero human error, speed
            <br>
            Con: Initial complexity, difficult debugging, rigidity
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Agentic automation with LangChain/OpenAI
            <br>
            <strong>
               Reason:
            </strong>
            The Quote-to-Cash cycle has 7 sequential stages (Budget → Contract → Billing
            → Requirements → Prototype → Manual → Transfer), each with 3-6 sub-actions.
            The agentic system detects milestone completion (e.g., "contract signed"
            webhook) → automatically triggers the next stage (create Asaas billing
            + schedule invoices + notify client + create Requirements profile in Notion).
            <br>
            <strong>
               Impact:
            </strong>
            Recovered 10h+ weekly by eliminating manual work. 27% reduction in total
            administrative time. Time from accepted
            budget to first deliverable dropped from 18 days to 5.3 days.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-javascript">
export const handler = async(event) = >{
  const body = JSON.parse(event.body);
  if (body.event === "contract_signed") {
    await orchestrateNextMilestone(body.projectId);
    return {
      statusCode: 200,
      body: "Pipeline state updated seamlessly."
    };
  }
};</code>
               </pre>
            </div>
            <p class="case-caption">
               Asynchronous serverless webhook listener intercepting third-party API
               execution tokens via secure runtime execution scopes.
            </p>
         </div>
         <h3>
            Final Solution
         </h3>
         <p class="p1">
            <strong>
               Technical Architecture:
            </strong>
            <br>
            - Source of Truth: Notion (7 relational databases with 47 custom properties)
            <br>
            - Frontend: Mobile-first PWA app with state-oriented conditional rendering
            <br>
            - Serverless Backend: Node.js (12 modules) — crypto.js (UUID encryption),
            webhooks, bidirectional sync
            <br>
            - Agentic Automation: LangChain/OpenAI orchestrating Quote-to-Cash milestones
            <br>
            - E-signature: Clicksign API (automatic generation of legal contracts)
            <br>
            - Payments: Asaas Fintech API (installment billing, automated invoices)
            <br>
            - Communication: 17 event-driven multi-channel transactional flows (push
            + email)
            <br>
            - DesignOps: Multi-state component library (Hibernate, Action Required,
            Fallback)
         </p>
         <p class="p1">
            <strong>
               Automated Quote-to-Cash Flow:
            </strong>
            <br>
            1.
            <strong>
               Encrypted Budget:
            </strong>
            Generates unique UUID → calculates formula → crypto.js encrypts sensitive
            values → non-indexable URL
            <br>
            2.
            <strong>
               Intelligent Acceptance:
            </strong>
            Client fills data → webhook triggers agentic framework → automatically
            generates Clicksign contract
            <br>
            3.
            <strong>
               Milestone Orchestration:
            </strong>
            Signature detected → system creates Asaas billing → schedules invoices
            → creates Notion profile → client notification
            <br>
            4.
            <strong>
               Absolute String Scheduling:
            </strong>
            Client books meeting → timezone-agnostic rule → 60-day horizon prevents
            no-shows
            <br>
            5.
            <strong>
               Latency-Free Deliveries:
            </strong>
            System downloads Notion PDF → private upload → generates 24h authenticated
            URL → contextual push notification
            <br>
            6.
            <strong>
               Event-Driven Approval:
            </strong>
            Client approves → registration of timestamp → triggers next milestone
            → UI component transitions state
            <br>
            7.
            <strong>
               Transfer and Post-Sales:
            </strong>
            Request → waits 10 contractual days → system creates Warranty profile
            → auto-reminders 14 days before expiry
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/5.avif" alt="Mobile app with project dashboard">
            </div>
            <p class="case-caption">
               Description: A smartphone interface screenshot displaying a mobile client
               portal tracking project deliverables ("Entregáveis"). It shows a "Requirements
               Document" marked as revised and approved with a download button, while
               subsequent items like the prototype remain under development.
            </p>
         </div>
         <h3>
            Results and Impact
         </h3>
         <p class="p1">
            <strong>
               Quantitative Metrics (6 months post-implementation):
            </strong>
            <br>
            - Manual work: 27% reduction, 10h+ weekly recovered via Q2C automation
            <br>
            - UI Consistency: 100% across 8+ project milestones via DesignOps framework
            <br>
            - Service capacity: from 3 to 12 simultaneous projects — 300% increase
            <br>
            - Delivery cycles: from 18 days to 5.3 days (budget → first deliverable)
            <br>
            - Privacy: Zero data leaks in 10 months (UUID + crypto.js)
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/graph.avif" alt="Q2C cycle growth via DaaS (Design as a Service)">
            </div>
            <p class="case-caption">
               Description: A clean horizontal bar chart titled "Aceleração do Ciclo
               Quote-to-Cash", comparing process efficiency in days. It demonstrates that
               an automated process takes 5.3 days compared to 18 days for a manual process,
               resulting in a 70.6% time reduction.
            </p>
         </div>
         <p class="p1">
            <strong>
               Qualitative Feedback:
            </strong>
            <br>
            <em>
               "I've never seen such an organized consultancy. I know exactly what stage
               it's in without asking."
            </em>
            — B2B Client, Education
            <br>
            <em>
               "Transparent price breakdown helped me justify it internally. It doesn't
               feel like a 'black box'."
            </em>
            — B2B Client, 35 employees
            <br>
            <em>
               "I get a notification when there's an update. It feels like an entire
               team is looking after it."
            </em>
            — B2C Client, liberal professional
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/holofante/6.avif" alt="Clicksign contract signature flow">
            </div>
            <p class="case-caption">
               Description: A desktop web browser screenshot of the ClickSign electronic
               signature platform. The page displays an audit log and timeline of events
               detailing the creation, signing, and automatic completion of a digital
               document in January 2026.
            </p>
         </div>
         <h3>
            Learnings & Reflections
         </h3>
         <p class="p1">
            <strong>
               What Worked:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. DesignOps as an investment, not overhead:
            </strong>
            Multi-state component framework (Hibernate, Action Required, Fallback)
            felt like initial over-engineering but guaranteed 100% consistency at scale.
            Feature development time dropped by 60%.
         </p>
         <p class="p1">
            <strong>
               2. Conditional Rendering = UX without latency:
            </strong>
            Transforming complex backend states into contextual UI was key. Client
            sees the interface react in &lt;2s, creating a "magical" sensation cited
            by 91% of users.
         </p>
         <p class="p1">
            <strong>
               3. UUID + encryption decoupled privacy from transparency:
            </strong>
            Governance framework allowed showing price breakdown (conversion +97%)
            while shielding data from crawlers. LGPD compliance without sacrificing
            UX.
         </p>
         <p class="p1">
            <strong>
               What I Would Do Differently:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Agentic framework required extensive logging:
            </strong>
            Orchestrating milestones with LangChain was powerful, but debugging race
            conditions consumed 40% of initial time. Improved event logging saved countless
            troubleshooting hours.
         </p>
         <p class="p1">
            <strong>
               2. Feature flags from v1:
            </strong>
            Without feature flags, I had to deploy hotfixes in a rush. Next version:
            toggles to disable features without redeployment.
         </p>
         <p class="p1">
            <strong>
               Key learning on agentic automation in services:
            </strong>
            LangChain/OpenAI orchestrating Quote-to-Cash proved that AI isn't just
            for chatbots — it can automate complex B2B workflows. It didn't replace
            the designer; it amplified capacity, freeing 10h+ weekly for strategic
            conversations.
         </p>
         <p class="p1">
            <strong>
               Next steps:
            </strong>
            With proven operational capacity (12 simultaneous projects), the next
            goal is to test the limit up to 18-20 projects. The current system is the
            basis for a white-label management SaaS for other design consultancies.
         </p>
               `,
        credits: ["Lio Schimanko"],
        videoSrc: "assets/videos/en-holofante.mp4",
        vttSrc: "assets/legendas/en-holofante.vtt",
        frameSrc: "assets/frames/holofante.avif",
        thumbSrc:"assets/thumbs/holofante.avif",
        deviceClass: "iphone-17",
    },
    {
        logoUrl:"assets/logos/holofante/logo.jpeg",
        id: "case-02",
        title: "Building an e-reader",
        year: "2025 ∙ Testamentus.org",
        liveUrl: "https://testamentus.org/",
        
        
        desc: `
         <p class="p1">
            <strong>
               Context:
            </strong>
            Existing digital Bible platforms prioritize monetization over user experience.
            Analysis of 8 main competitors revealed a problematic pattern: intrusive
            ads interrupting spiritual reading, 5-12 second loading times on mobile,
            and overloaded interfaces compromising concentration.
         </p>
         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">
                     +143%
               </span>
               <span class="metric-label">
                     Increase in average session duration
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     US$ 5/month
               </span>
               <span class="metric-label">
                     Fixed cost for scalable infrastructure
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     0.9s
               </span>
               <span class="metric-label">
                     FCP Performance (100/100 PageSpeed)
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     92/100
               </span>
               <span class="metric-label">
                     WCAG AA Accessibility Compliance
               </span>
            </div>
         </div>
         <h3>
            Business and Product Challenge
         </h3>
         <p class="p1">
            <strong>
               Core Problem:
            </strong>
            How to create a Bible platform that respects the sacredness of content
            through focused design, exceptional performance, and total absence of monetization?
         </p>
         <p class="p1">
            <strong>
               Constraints:
            </strong>
            <br>
            - Zero budget — personal project without investment
            <br>
            - Shared server (512MB RAM, limited resources)
            <br>
            - Support 40+ languages globally without paid CDN
            <br>
            - Solo maintainer — long-term sustainable architecture
            <br>
            - Commitment: no ads, no donations, no paywall
         </p>
         <p class="p1">
            <strong>
               Measurable Objectives:
            </strong>
            <br>
            - First Contentful Paint
            <1.5s (vs ~5s industry benchmark)<br>
               - WCAG AA compliance (score >90/100)
               <br>
               - Completion rate >85% (vs ~75% benchmark)
               <br>
               - Session duration >5min (vs ~3.5min benchmark)
         </p>
         <p class="p1">
            <strong>
               Project Members:
            </strong>
            Lio Schimanko
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/1.avif" alt="Lean UX cycle diagram">
            </div>
            <p class="case-caption">
               Lean UX Methodology — fast validation cycles instead of extensive specification.
            </p>
         </div>
         <h3>
            Research & Discovery
         </h3>
         <p class="p1">
            <strong>
               Methods Used:
            </strong>
            <br>
            - Competitive analysis of 8 platforms with Nielsen heuristics + PageSpeed
            benchmarks
            <br>
            - 12 in-depth interviews (pastors, educators, scholars, casual readers)
            <br>
            - Comparative tests: 6 users performing identical tasks on 3 competitors
         </p>
         <p class="p1">
            <strong>
               Research & Design:
            </strong>
            Figma, Nielsen Heuristics, Moderated Usability Tests, Accessibility (WCAG
            AA)
            <br>
            <strong>
               Performance Engineering:
            </strong>
            PHP, MySQL (Static Generation), Vanilla JS, LocalStorage, Full-text Search
            <br>
            <strong>
               Metrics & Validation:
            </strong>
            Lean UX (Build-Measure-Learn), Google PageSpeed Insights, Lighthouse
         </p>
         <p class="p1">
            <strong>
               Key Insights:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Ads destroy reverence:
            </strong>
            100% cited ads as "disrespectful to sacred content." Users developed extreme
            banner blindness.
         </p>
         <p class="p1">
            <strong>
               2. Performance = respect:
            </strong>
            Loading >3s led to 58% abandonment on mobile. Discovery: users interpreted
            slowness as
            <strong>
               lack of care
            </strong>
            , not a technical limitation.
         </p>
         <p class="p1">
            <strong>
               3. Simplicity = focus:
            </strong>
            89% never used "advanced" features. Real use: (1) sequential reading,
            (2) verse search, (3) toggling translations.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/2.avif" alt="Personas: Pastor Davi, Maria Santos, Samuel">
            </div>
            <p class="case-caption">
               Personas — speed vs. depth vs. accessibility.
            </p>
         </div>
         <h3>
            Design Process & Critical Decisions
         </h3>
         <p class="p1">
            <strong>
               Critical Decision #1: Static Generation vs. Dynamic Application
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Dynamic PHP (HTML generation per request)
            </strong>
            <br>
            Pro: Flexibility, complex features (login, cloud favorites)
            <br>
            Con: 2-4s loading, high RAM consumption, higher server cost
         </p>
         <p class="p1">
            <strong>
               Option B: Static generation (MySQL → pre-rendered HTML)
            </strong>
            <br>
            Pro: 0.1-0.3s performance, minimal RAM, horizontal scalability
            <br>
            Con: No dynamic features (login impossible)
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Static + client-side JavaScript
            <br>
            <strong>
               Reason:
            </strong>
            94% preferred simplicity over creating an account. Script converts 31k
            verses into ~1,200 HTML pages per Bible version. Client-side JS handles search and favorites without server calls.
            <br>
            <strong>
               Impact:
            </strong>
            FCP 0.9s (vs ~4.2s dynamic) — 367% improvement. Server supports 10,000+
            simultaneous req/s.
         </p>
         <p class="p1">
            <strong>
               Critical Decision #2: Times New Roman vs. Modern Sans-Serif
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Classic Serif (Times New Roman)
            </strong>
            <br>
            Pro: Biblical tradition, long text legibility, zero cost (web-safe)
            <br>
            Con: "Outdated" perception
         </p>
         <p class="p1">
            <strong>
               Option B: Sans-serif (Inter via Google Fonts)
            </strong>
            <br>
            Pro: Modern, clean contrast on screens
            <br>
            Con: 20-40KB extra, CDN dependency
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Times for reader + Arial for UI
            <br>
            <strong>
               Reason:
            </strong>
            Users 55+ associated Times with "real Bible."
            <br>
            <strong>
               Impact:
            </strong>
            Satisfaction 55+: 9.2/10. Zero bytes of web fonts.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/sketch.avif" alt="Low-fi sketch of the Social Sharing functionality">
            </div>
            <p class="case-caption">
               Low-fi sketch of the Social Sharing functionality.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #3: URL Sharing vs. Image Generation
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Direct link to verse
            </strong>
            <br>
            Pro: Trivial, SEO-friendly
            <br>
            Con: Low social engagement (generic link)
         </p>
         <p class="p1">
            <strong>
               Option B: PNG image with verse (PHP GD)
            </strong>
            <br>
            Pro: Viral on social media, branding
            <br>
            Con: Technical complexity, server consumption
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            Both — URL + "Share as Image" button
            <br>
            <strong>
               Reason:
            </strong>
            Academic sharing prefers links; social prefers images.
            <br>
            <strong>
               Impact:
            </strong>
            68% use images, 32% URL.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/3.avif" alt="Sharing menu and generated image">
            </div>
            <p class="case-caption">
               Dual system — URL for context, image for virality.
            </p>
         </div>
         <p class="p1">
            <strong>
               Critical Decision #4: Favorites with Login vs. Local localStorage
            </strong>
         </p>
         <p class="p1">
            <strong>
               Option A: Login + sync across devices
            </strong>
            <br>
            Pro: Cross-device access, automatic backup
            <br>
            Con: Breaks simplicity, requires infra (auth, LGPD), registration friction
         </p>
         <p class="p1">
            <strong>
               Option B: Pure localStorage (data in browser)
            </strong>
            <br>
            Pro: Zero friction, total privacy, trivial implementation
            <br>
            Con: No sync, loss if cache is cleared
         </p>
         <p class="p1">
            <strong>
               Tradeoff Chosen:
            </strong>
            localStorage + manual JSON export/import
            <br>
            <strong>
               Reason:
            </strong>
            80% use a single device.
            <br>
            <strong>
               Impact:
            </strong>
            73% use favorites (vs ~20% on platforms with login).
         </p>
         <h3>
            Final Solution
         </h3>
         <p class="p1">
            <strong>
               Technical Architecture:
            </strong>
            <br>
            - PHP Script: MySQL (40 languages, 31,102 verses) → 1,200 static HTML
            pages
            <br>
            - Frontend: HTML5 + CSS3 (18KB) + Vanilla JS (12KB) — zero dependencies
            <br>
            - Search: PHP + MySQL FULLTEXT with cache
            <br>
            - Persistence: localStorage + JSON export
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/4.avif" alt="PageSpeed 100/100: FCP 0.9s, LCP 1.1s">
            </div>
            <p class="case-caption">
               Performance — 100/100 mobile, 80% faster than benchmark.
            </p>
         </div>
         <h3>
            Results and Impact
         </h3>
         <p class="p1">
            <strong>
               Quantitative Metrics (6 months):
            </strong>
            <br>
            - Mobile performance: 100/100, FCP 0.9s (vs ~5s industry) — 456% faster
            <br>
            - Accessibility: 92/100 WCAG AA
            <br>
            - Task completion: 92% (vs 75%)
            <br>
            - Session duration: 8.5min (vs 3.5min) — +143%
            <br>
            - Bounce rate: 15% (vs 45%)
            <br>
            - Recurring users: 67% return in 7 days
            <br>
            - Cost: US$ 5/month for shared hosting (vs $50-200 for performance-optimized)
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="assets/cases/testamentus/5.avif" alt="Mobile in Dark Mode and Accessibility Menu">
            </div>
            <p class="case-caption">
               Navigation with accessibility features.
            </p>
         </div>
         <h3>
            Learnings & Reflections
         </h3>
         <p class="p1">
            <strong>
               What Worked:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Performance as a feature:
            </strong>
            Treating speed as a functional requirement from wireframes avoided rework.
         </p>
         <p class="p1">
            <strong>
               2. Validation saved months:
            </strong>
            "Users need login" hypothesis invalidated in 2 days — saved ~80h of development.
         </p>
         <p class="p1">
            <strong>
               3. Radical simplicity:
            </strong>
            Going against the trend of infinite features generated loyalty.
         </p>
         <p class="p1">
            <strong>
               What I Would Do Differently:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. A11y tests with real users from start:
            </strong>
            Trusted auto-validators. Simple issues (labels, tab order) detected late.
         </p>
         <p class="p1">
            <strong>
               2. Architecture Decision Records:
            </strong>
            Documented decisions only at the end. Almost forgot tradeoffs when considering
            new features.
         </p>
         <p class="p1">
            <strong>
               3. Planned i18n from v1:
            </strong>
            Refactored ~60% of templates for full translation.
         </p>
         <p class="p1">
            <strong>
               Key learning:
            </strong>
            UCD means
            <strong>
               removing friction
            </strong>
            . Designer as "user advocate" = saying "no" to 90% of ideas.
         </p>
        `,
        credits: ["Lio Schimanko"],
        videoSrc: "assets/videos/en-testamentus.mp4",
        vttSrc: "assets/legendas/en-testamentus.vtt",
        frameSrc: "assets/frames/holofante.avif",
        thumbSrc:"assets/thumbs/testamentus.avif",
        deviceClass: "iphone-17",
        customGap: "0px",
    },
    {
        logoUrl:"assets/logos/cassi.jpeg",
        id: "case-03",
        year: "2023 ∙ CASSI",
        title: "UX for Wearables",
        desc: `
<p class="p1">
<strong>Note on experimental nature:</strong> This is an experimental design and proof of concept. It was not implemented in production, thus it has no measured real-world impact. The project demonstrates the application of Apple Human Interface Guidelines for watchOS 10 in a healthcare context.
</p>

<div class="impact-dashboard">
    <div class="metric-card">
        <span class="metric-value">2 Core</span>
        <span class="metric-label">Features focused on retention and brevity</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">1 Gesture</span>
        <span class="metric-label">Emergency access via Apple Wallet</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">< 3s</span>
        <span class="metric-label">Time to comprehension (Glanceability)</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">100%</span>
        <span class="metric-label">Compliance with Apple HIG</span>
    </div>
</div>

<h3>Design Challenge</h3>

<p class="p1">
Based on projects developed at CASSI, identify which mobile features would add maximum value in a wearable context. Constraints: 40-45mm screen, interactions <5s, glanceability.
</p>

<p class="p1">
<strong>Core Problem:</strong> How to adapt critical health plan features (authorization view, emergency card) for a wearable interface with sub-5 second interactions?
</p>

<p class="p1">
<strong>Platform Constraints:</strong><br>
- Limited screen: 324×394px or 368×448px<br>
- Brief interactions: users consult on the go<br>
- Critical info hierarchy: max 3-5 data points per screen<br>
- Apple HIG watchOS 9 compliance
</p>

<p class="p1"><strong>Project Members:</strong> Lio Schimanko, Illa Penha, Felipe Pires & Luís Aragão</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/watch/2.avif" alt="Medical authorization visualization">
   </div>
   <p class="case-caption">Medical authorization visualization — critical information prioritized for <3s glanceability.</p>
</div>

<h3>Research & Design Decisions</h3>

<p class="p1">
<strong>Methods Used:</strong><br>
- Analysis of previous CASSI projects<br>
- Identification of most-accessed mobile features (internal analytics)<br>
- User flow mapping for wearables<br>
- Study of Apple watchOS 10 Human Interface Guidelines
</p>

<p class="p1">
<strong>Design & Prototyping:</strong> Figma, Apple watchOS UI Kit, SF Compact Typography<br>
<strong>Ecosystem & Compliance:</strong> Apple HIG, Apple Wallet integration (PassKit)<br>
<strong>Product Strategy:</strong> Mobile-to-Wearable translation
</p>

<p class="p1">
<strong>Critical Decision #1: Which Features to Port?</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> 2 core features (authorizations + emergency card)<br>
<strong>Reason:</strong> Analysis showed authorizations (monitoring expenses) and emergency cards are the most critical use cases. Authorizations = passive daily use; card = active emergency use.<br>
<strong>Impact:</strong> Aligned with Apple's philosophy of radical simplicity.
</p>

<p class="p1">
<strong>Critical Decision #2: Information Hierarchy in Authorizations</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> Spaced list with radical visual hierarchy<br>
<strong>Reason:</strong> Users consult while walking or waiting. Prioritized 3 critical data points: (1) Procedure type, (2) Value, (3) Recent date.<br>
<strong>Impact:</strong> <3s glanceability.
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/watch/1.avif" alt="Emergency card in Apple Wallet">
   </div>
   <p class="case-caption">Emergency card — Apple Wallet integration for instant sharing via AirDrop/Messages.</p>
</div>

<p class="p1">
<strong>Critical Decision #3: Card Access — Native App vs. Apple Wallet</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> Dual — in-app card + "Add to Wallet" button<br>
<strong>Reason:</strong> Emergency use requires maximum speed. Apple Wallet allows access in 1 gesture (double-click side button), even when locked.<br>
<strong>Impact:</strong> Velocity > Branding in emergency healthcare situations.
</p>

<h3>Design Solution</h3>

<p class="p1">
<strong>Information Architecture:</strong><br>
1. <strong>Authorization List:</strong> Spaced cards with type/value/date<br>
2. <strong>Authorization Details:</strong> Provider name, address, ANS code<br>
3. <strong>Card:</strong> QR code + essential data<br>
4. <strong>Apple Wallet Pass:</strong> Instant double-click access
</p>

<h3>Design Learnings</h3>

<p class="p1">
<strong>1. Less is more in wearables:</strong> Porting only 2 features followed HIG philosophy. Every additional screen is exponential friction.
</p>

<p class="p1">
<strong>2. Visual hierarchy saves glanceability:</strong> SF Compact Display Bold for values allowed <3s comprehension.
</p>

<p class="p1">
<strong>3. Native integration > customization:</strong> Apple Wallet sacrificed branding but gained life-saving speed.
</p>

<p class="p1">
<strong>Key learning on healthcare wearable design:</strong> Critical info in stress/motion context must be <strong>glanceable</strong> and <strong>actionable</strong>. This requires sacrificing density for radical simplicity.
</p>
        `,
        credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
        videoSrc: "assets/videos/en-cassiwatch.mp4",
        vttSrc: "assets/legendas/en-cassiwatch.vtt",
        thumbSrc:"assets/thumbs/cassiwatch.avif",
        deviceClass: "apple-watch",
        customGap: "0px",
    },
    {
        logoUrl:"assets/logos/cassi.jpeg",
        id: "case-04",
        year: "2022 ∙ CASSI",
        title: "US$400k Redesign",
        desc: `
<p class="p1">
<strong>NDA Note:</strong> This project is protected by compliance and non-disclosure agreements. Full flows, detailed research, and sensitive findings cannot be displayed. The case presents a sanitized overview focusing on methods, design decisions, and public results from the 2022 Annual Report.
</p>

<div class="impact-dashboard">
    <div class="metric-card">
        <span class="metric-value">USD 400,000</span>
        <span class="metric-label">Annual savings in avoided expenses</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">13,000</span>
        <span class="metric-label">Proactively disputed authorizations</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">15s</span>
        <span class="metric-label">Search time (reduced from 3min)</span>
    </div>
    <div class="metric-card">
        <span class="metric-value">30,000</span>
        <span class="metric-label">Unrecognized procedures</span>
    </div>
</div>

<h3>Business Challenge</h3>

<p class="p1">
Develop software for disputing unrecognized medical authorizations with an intuitive interface for web, iOS, and Android. Systemic problem: providers were sending undue authorizations, generating unrecognized expenses for users and institutional financial control difficulties.
</p>

<p class="p1">
<strong>Core Problem:</strong> How to empower 229,000 mobile users (29% of the 792,000 participants) to dispute undue authorizations, reducing healthcare expenses and improving transparency?
</p>

<p class="p1">
<strong>Constraints:</strong><br>
- ANS (National Health Agency) requires 20+ mandatory items on the procedure statement<br>
- Confusing legacy interface without visual hierarchy<br>
- Non-existent dispute flow — zero user control<br>
- LGPD compliance for sensitive health data<br>
- Multidisciplinary team: 8 people (4 UX Research, 4 UI Design)
</p>

<p class="p1">
<strong>Measurable Objectives:</strong><br>
- Reduce undue healthcare expenses via user disputes<br>
- Improve app store ratings (post-update engagement)<br>
- Ensure ANS compliance with optimized UX<br>
- Create a provider quality matrix based on dispute data
</p>

<p class="p1"><strong>Project Members:</strong> Lio Schimanko, Illa Penha, Felipe Pires, Luís Aragão, Marcelo Megale, Carina Lopes, Jordana Leijoto </p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/1.avif" alt="CSD Matrix">
   </div>
   <p class="case-caption">Full research and findings protected by compliance — displaying sanitized CSD matrix only.</p>
</div>

<h3>Research & Discovery</h3>

<p class="p1">
<strong>Methods used:</strong><br>
- User interviews (CASSI participants)<br>
- Competitive analysis of health apps (competitor plans)<br>
- Functionality Matrix and CSD Matrix<br>
- "How Might We" methodology for opportunity identification<br>
- Empathy and Mood Maps, Personas<br>
- User Flow with Touchpoints, Pain Points, and Opportunities<br>
- Discussions with ANS focal points (regulatory requirements)<br>
- Internal stakeholder interviews (provider relationship management)
</p>

<p class="p1">
<strong>Research & Discovery:</strong> FigJam, CSD Matrix, In-depth Interviews, Empathy Map<br>
<strong>Design & Handoff:</strong> Figma, Institutional Design System, High-Fidelity Prototyping<br>
<strong>Analytics & Compliance:</strong> Hotjar, Google Analytics, ANS (National Health Agency) Regulation, LGPD
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/sketch.avif" alt="Low-fi sketch">
   </div>
   <p class="case-caption">Full research and findings protected by compliance — displaying sanitized low-fi only.</p>
</div>

<p class="p1">
<strong>Key Insights:</strong>
</p>

<p class="p1">
<strong>1. Bilateral Systemic Problem:</strong> Research revealed the issue went beyond UX — providers were sending undue authorizations without penalty. The solution needed to address two sides: (1) empowering the user to dispute, (2) creating incentives for providers to avoid incorrect authorizations.
</p>

<p class="p1">
<strong>2. Confusing Statement Prevented Quick Identification:</strong> The old interface displayed 20+ ANS items without hierarchy in a dense list without white space. Users took minutes to find relevant data (procedure name, date, provider). Conversations with ANS clarified: displaying 20+ items is mandatory, but <em>order and hierarchy are flexible</em> — giving us freedom for a redesign.
</p>

<p class="p1">
<strong>3. Non-existent Temporal Filtering:</strong> Viewing authorizations from previous months was long and confusing, with no visual demarcations separating periods. Users were lost in infinite scrolling without temporal context.
</p>

<p class="p1">
<strong>4. Dependent User Switching Required Logout:</strong> In family plans, the policyholder ("parent") had to log out and log back in as a dependent ("child") to see their authorizations. This massive friction was cited in 100% of interviews with policyholders.
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/3.avif" alt="Before and after consultation screen">
   </div>
   <p class="case-caption">Before and after (v1) — visual hierarchy and white space significantly improved legibility.</p>
</div>

<h3>Design Process & Critical Decisions</h3>

<p class="p1">
<strong>Work Strategy:</strong> We divided the team: half researched ANS requirements and provider interactions, while the other half started designing based on early findings. Parallel work accelerated delivery, allowing for continuous iteration as research progressed.
</p>

<p class="p1">
<strong>Critical Decision #1: Visual Hierarchy vs. Dense ANS List</strong>
</p>

<p class="p1">
<strong>Option A: Maintain dense list (20+ items visible simultaneously)</strong><br>
Pro: Guaranteed ANS compliance, zero regulatory risk<br>
Con: Cognitive overload, low usability, high search time
</p>

<p class="p1">
<strong>Option B: Reorganize into hierarchical categories (consultations, exams, follow-ups)</strong><br>
Pro: Scannability, legibility, quick localization<br>
Con: Risk of incorrect interpretation of ANS regulations
</p>

<p class="p1">
<strong>Chosen tradeoff:</strong> Categorical visual hierarchy with all 20+ items preserved<br>
<strong>Reason:</strong> Validation with ANS focal points confirmed: items are mandatory, but the order is free. We created a hierarchical structure — collapsible categories (Consultations, Exams, Follow-ups) with priority data highlighted (procedure name, provider, date). Users scan quickly, expand the relevant category, and see all ANS items.<br>
<strong>Impact:</strong> Average localization time for a specific procedure fell from ~3min to ~15s (Hotjar data post-launch). Interview feedback: "I can finally understand my statement."
</p>

<p class="p1">
<strong>Critical Decision #2: Linear Filters vs. Visual Demarcation System</strong>
</p>

<p class="p1">
<strong>Option A: Traditional month/year dropdown</strong><br>
Pro: Market standard, familiar, trivial implementation<br>
Con: Friction (open dropdown, select, close), no visual temporal context
</p>

<p class="p1">
<strong>Option B: Dual sliders (vertical temporal + horizontal categorical)</strong><br>
Pro: Fluid navigation, rich visual context, agility<br>
Con: Unfamiliar pattern, risk of user confusion
</p>

<p class="p1">
<strong>Chosen tradeoff:</strong> Dual system — vertical slider (months) + horizontal slider (categories)<br>
<strong>Reason:</strong> Data showed that users look for temporal patterns ("what exams did I do in January?") and categorical patterns ("all my recent consultations"). The vertical slider shows visual monthly separators, while the horizontal slider filters by type (Consultations, Exams, Therapies). Both are combined without dropdown friction.<br>
<strong>Impact:</strong> Abandonment rate when searching for old procedures fell by 47% (Google Analytics). Users navigate previous months without frustration — clear visual markers create a temporal mental map.
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/4.avif" alt="Filtering system">
   </div>
   <p class="case-caption">Visual demarcation system — vertical (months) and horizontal (categories) sliders eliminate search friction.</p>
</div>

<p class="p1">
<strong>Critical Decision #3: Dependent Switching with Logout vs. Swipe Gesture</strong>
</p>

<p class="p1">
<strong>Option A: Maintain logout → dependent login flow</strong><br>
Pro: Maximum security (re-authentication), existing architecture<br>
Con: Massive friction, high time consumption, task abandonment
</p>

<p class="p1">
<strong>Option B: Side swipe to toggle between policyholder ↔ dependent</strong><br>
Pro: Fluency, zero friction, familiar mobile pattern<br>
Con: Security risk (unauthorized access), implementation complexity
</p>

<p class="p1">
<strong>Chosen tradeoff:</strong> Side swipe with shared authenticated session<br>
<strong>Reason:</strong> 100% of interviewed policyholders cited logout/login as a critical pain point — especially mothers tracking minor children. We architected a secure shared session system — the policyholder authenticates once, and a side swipe switches the data context (policyholder vs. dependent) without re-logging. Security is preserved: the already authenticated policyholder has the legal right to access dependent data.<br>
<strong>Impact:</strong> Average switching time from policyholder → dependent fell from ~45s (logout + login) to ~1s (swipe). Feature cited in 89% of positive feedback post-launch. Mothers reported: "Now I can see my children's consultations without wasting time."
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/6.avif" alt="User switch swipe">
   </div>
   <p class="case-caption">Side swipe — policyholder ↔ dependent context change without logout, preserving authenticated session security.</p>
</div>

<p class="p1">
<strong>Critical Decision #4: Passive Dispute vs. Actionable Push Notification</strong>
</p>

<p class="p1">
<strong>Option A: Dispute button inside the app (user searches actively)</strong><br>
Pro: No risk of notification fatigue, total user control<br>
Con: Low awareness, users don't know they can dispute, low usage rate
</p>

<p class="p1">
<strong>Option B: Push notification with direct "I don't recognize this" CTA</strong><br>
Pro: Maximum awareness, instant action, high conversion<br>
Con: Risk of irritation (frequent notifications), opt-out
</p>

<p class="p1">
<strong>Chosen tradeoff:</strong> Contextual push notification with direct deep link<br>
<strong>Reason:</strong> Research showed that most users did not check the app proactively — undue authorizations went unnoticed. The push notification triggers when a new authorization is registered, displays the procedure/provider/date, and offers an "I don't recognize this" button that opens the app directly on the dispute screen. The user acts in a "warm" context (recent memory of the consultation).<br>
<strong>Impact:</strong> 13,000 authorizations disputed in 2022 (Annual Report p. 38) — a volume unreachable without proactive pushes."
</p>

<h3>Final Solution</h3>

<p class="p1">
<strong>Key functionalities:</strong><br>
1. <strong>Categorical Visual Hierarchy:</strong> 20+ ANS items organized into collapsible categories (Consultations, Exams, Therapies, Follow-ups) with priority data highlighted.<br>
2. <strong>Dual Filtering System:</strong> Vertical slider (monthly demarcation) + horizontal slider (categories) for fluid temporal and thematic navigation.<br>
3. <strong>Policyholder ↔ Dependent Side Swipe:</strong> Switches context without logout, using a shared authenticated session while preserving security.<br>
4. <strong>Actionable Push Notifications:</strong> Contextual trigger with a direct deep link for dispute, displaying procedure/provider/date.<br>
5. <strong>Simplified Dispute Flow:</strong> "I don't recognize this" button → confirmation screen with procedure data → dispute submission → CASSI contacts the provider for clarification.<br>
6. <strong>Communication Transparency:</strong> Users receive status updates on the dispute (submitted, under review, resolved) via notifications and an in-app timeline.
</p>

<p class="p1">
<strong>Impact on Providers (Bilateral Strategy):</strong> Management gave the green light to create a provider quality matrix — disputes now count negatively in the annual evaluation. This creates an incentive for providers to avoid undue authorizations, aligning institutional interests with user UX.
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/5.avif" alt="Information hierarchy">
   </div>
   <p class="case-caption">Clear categorization — consultations, exams, and follow-ups visually separated with priority data in focus.</p>
</div>

<h3>Results and Impact</h3>

<p class="p1">
<strong>Quantitative metrics (CASSI 2022 Annual Report):</strong><br>
- Impacted population: 229,664 iOS/Android users (29% of 792,384 participants) — p. 64<br>
- Disputed authorizations: 13,000 in 2022 (operational) — p. 38<br>
- Unrecognized procedures: 30,000 in 2022 (operational) — p. 38<br>
- Financial savings: R$ 2.5 million in avoided expenses from unrecognized procedures (annual) — p. 38<br>
- Most disputed services: Consultations, laboratory exams, therapies<br>
- App store ratings: Improved iOS and Android ratings post-launch update<br>
- Abandonment rate for old procedure searches: 47% reduction (Google Analytics)
</p>

<p class="p1">
<strong>Systemic Impact 2023:</strong> The dispute system influenced the provider relationship quality matrix the following year — scoring based on disputes encourages transparency and improved communication.
</p>

<p class="p1">
<strong>Qualitative Feedback:</strong><br>
<em>"I can finally understand my statement. Before it was just a confusing list."</em> — Primary participant<br>
<em>"I got a notification for a consultation I didn't do and disputed it on the spot. Very easy."</em> — Individual participant<br>
<em>"Now I can see my children's consultations without wasting time logging in and out of the account."</em> — Primary participant with dependents
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/consulta/7.avif" alt="Results">
   </div>
   <p class="case-caption">Systemic impact — 13,000 disputes, R$ 2.5 million saved, provider quality matrix influenced.</p>
</div>

<h3>Learnings & Reflections</h3>

<p class="p1">
<strong>What worked:</strong>
</p>

<p class="p1">
<strong>1. Bilateral Approach (User + Provider):</strong> Research showed that solving only the UX would not fix the systemic problem. The provider quality matrix proposal, validated with stakeholders, created a structural incentive to reduce undue authorizations. User-centered design + institutional strategy = scalable impact.
</p>

<p class="p1">
<strong>2. Early Regulatory Validation:</strong> Speaking with ANS focal points before finalizing designs avoided massive rework. Clarification on display freedom (free order) unlocked the visual hierarchy that transformed usability. Lesson: regulatory constraints can be opportunities, not just limitations.
</p>

<p class="p1">
<strong>3. Push Notifications as Awareness, Not Spam:</strong> The decision to use contextual pushes (not generic "you have updates") was critical. Displaying procedure data directly in the notification created a legitimate sense of urgency — users act while their memory is fresh.
</p>

<p class="p1">
<strong>What I would do differently:</strong>
</p>

<p class="p1">
<strong>1. Usability Testing with Seniors from the Start:</strong> CASSI has a significant 55+ base. We discovered late that the side swipe was not intuitive for some older users. A post-launch iteration added an alternative visual button ("Switch to [Dependent Name]"). Testing with demographic extremes from the wireframe stage would have anticipated this.
</p>

<p class="p1">
<strong>2. Baseline Metrics Before Launch:</strong> We managed to measure post-launch impact (13,000 disputes), but we didn't have a reliable baseline of how many undue authorizations went unnoticed <em>before</em>. It's difficult to quantify relative improvement. Future projects: establish control metrics before the change.
</p>

<p class="p1">
<strong>3. Documentation of Regulatory Edge Cases:</strong> ANS has dozens of specific rules (e.g., the difference between "follow-up" and "consultation" affects billing). Documenting all edge cases during research would have accelerated design validation. We created a regulatory glossary halfway through — it should have been the first deliverable.
</p>

<p class="p1">
<strong>Key Learning on Regulated Health Design:</strong> Healthcare projects require a unique balance between UX, regulatory compliance, and systemic incentives. The best interface in the world won't solve the problem if providers continue to send wrong authorizations without penalty. Product design in health = <em>ecosystem</em> design, not just interface. Collaboration with stakeholders (ANS, management, legal) from discovery, not just final validation, is a critical differentiator.
</p>

<p class="p1">
<strong>Impact Beyond Digital:</strong> This project highlighted the importance of user-centered design and multidisciplinary collaboration. Tangible results (R$ 2.5 million saved, 13,000 disputes, influenced provider quality matrix) proved that investment in UX research and iterative design generates measurable value — not just subjective satisfaction, but institutional financial and operational impact.
</p>
        `,
        credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
        videoSrc: "assets/videos/en-consulta.mp4",
        vttSrc: "assets/legendas/en-consulta.vtt",
        thumbSrc:"assets/thumbs/consulta.avif",
        deviceClass: "iphone-12",
    }
];