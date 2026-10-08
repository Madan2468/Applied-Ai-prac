# Master Autonomous Protocol (Superpowers, MCP & Workflow Orchestration)

Antigravity MUST actively and automatically leverage all available tools, MCP servers, plugins, and skills based on the specific operational use case:

---

### 1. Complex Reasoning, System Architecture & Multi-Agent Design
**Tools & Skills:** `sequential-thinking` (`@modelcontextprotocol/server-sequential-thinking`), `gsd-map-codebase`, `google-antigravity-sdk`
- **When to Use:**
  - Architecting full-stack systems, multi-agent AGY SDK implementations, state management refactors, schema designs, or algorithms.
  - Deep-dive debugging when root causes involve race conditions, async event loops, or multi-file dependencies.
  - Planning multi-phase workflows with hypothesis testing, counterfactual analysis, and backtracking.
- **Protocol:**
  - Decompose non-trivial problems into step-by-step sequential hypotheses before committing edits.

---

### 2. Persistent Cross-Session Memory & Architectural Knowledge
**Tool:** `memory` (`@modelcontextprotocol/server-memory`)
- **When to Use:**
  - Establishing project conventions, design systems, API key locations, user preferences, and architectural directives.
  - Recalling previously agreed decisions, entity relationships, and structural choices across past conversations and workspaces.
- **Protocol:**
  - Save key decisions, data schemas, reusable patterns, and entity relations into the local knowledge graph.

---

### 3. High-End UI/UX Design, Storytelling & Interactive Animations
**Tools & Skills:** `modern-web-guidance`, `shadcn`, `21st`, `StitchMCP`, `generate_image`, `chrome-extensions`
- **When to Use:**
  - Creating landing pages, web dashboards, storytelling web experiences, Chrome extensions (Manifest V3), interactive modals, and design systems.
  - Implementing modern visual features (Glassmorphism, backdrop filters, CSS Anchor Positioning, View Transitions, scroll-driven animations, container queries, `:has()`, `:user-valid`).
  - Generating custom AI graphics, textures, hero images, and visual assets without static placeholders.
- **Protocol:**
  - Execute `modern-web-guidance` first for UI/CSS tasks. Query official component registries (`shadcn`, `21st`) for exact code and props. Use `generate_image` for bespoke visual assets.

---

### 4. Browser Inspection, Visual Quality, Performance & Accessibility (a11y)
**Tools & Skills:** `chrome-devtools`, `a11y-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`
- **When to Use:**
  - Real-browser UI rendering validation, DOM tree inspection, computed style analysis, and console/network debugging.
  - Lighthouse audits, Core Web Vitals (LCP/INP) performance optimization, and JS/Node memory leak analysis.
  - WCAG accessibility checks (ARIA labels, keyboard focus, color contrast, tap targets).
- **Protocol:**
  - Audit UI states visually with browser snapshots and screenshots before declaring tasks complete. Run Lighthouse/a11y checks on interactive flows.

---

### 5. Backend, Relational/NoSQL Databases & Security Architecture
**Tools & Skills:** `mongodb-mcp-server`, `firebase` suite (`firebase-firestore`, `firebase-auth-basics`, `firebase-security-rules-auditor`, `firebase-data-connect`, `firebase-ai-logic-basics`, `firebase-crashlytics`, `firebase-remote-config-basics`)
- **When to Use:**
  - Designing relational (PostgreSQL / Data Connect) or document (MongoDB, Firestore) databases, indexes, queries, aggregation pipelines, and schema migrations.
  - Implementing user authentication, security rules, real-time database sync, Remote Config feature flags, and Gemini AI Logic integration.
- **Protocol:**
  - Run security rule audits (`firebase-security-rules-auditor`) and inspect query performance (`explain`) to prevent data leaks and slow queries.

---

### 6. Mobile & Cross-Platform Development (Android & iOS)
**Tools & Skills:** `android-cli`, `xcode-project-setup`
- **When to Use:**
  - Building, running, and inspecting native Android apps (AVD management, screenshots, SDK components) or configuring iOS Xcode projects.
- **Protocol:**
  - Safely update manifest files, dependencies, build configurations, and virtual device states.

---

### 7. Deployment, Cloud Hosting & CI/CD Pipelines
**Tools & Skills:** `netlify`, `firebase-hosting-basics`, `firebase-app-hosting-basics`
- **When to Use:**
  - Deploying static web applications, Single Page Apps, microservices, or Next.js/Angular backends to Netlify or Firebase App Hosting.
- **Protocol:**
  - Verify build outputs and deployment rules before publishing production bundles.

---

### 8. Official Documentation & Library Lookups
**Tool:** `context7`
- **When to Use:**
  - Using or updating any modern framework, library, SDK, API, or CLI tool (React 19, Next.js, Vite, Tailwind, Prisma, MongoDB, Express, etc.).
- **Protocol:**
  - Resolve library IDs and query official docs via Context7 before writing code to eliminate deprecated syntax and API errors.

---

### 9. Academic Literature & Domain Scientific Research
**Tools & Skills:** `literature-search-openalex`, `literature-search-arxiv`, `literature-search-biorxiv`, `pubmed-database`, `chembl-database`, `clinical-trials-database`, `uniprot-database`, `pdb-database`, `alphafold-database-fetch-and-analyze`
- **When to Use:**
  - Searching academic papers, preprints, biomedical data, clinical trials, chemical structures, or protein models.
- **Protocol:**
  - Execute precise API/literature queries and cite DOIs/accessions accurately.

---

### 10. Autonomous GSD Pipelines & Quality Gates
**Tools & Skills:** `gsd` suite (`gsd-audit-fix`, `gsd-ui-review`, `gsd-execute-phase`, `gsd-ship`, `gsd-quick`)
- **When to Use:**
  - Structuring project roadmaps, running automated audit-to-fix loops, conducting 6-pillar visual UI reviews, and executing phases with strict verification.
- **Protocol:**
  - Use GSD state tracking and verification loops to execute tasks systematically, verify implementation against requirements, and commit clean code.

---

### 11. Agentic AI Systems, RAG Pipelines & Knowledge Retrieval
**Tools & Skills:** `google-antigravity-sdk`, `firebase-ai-logic-basics`, `memory`, `mongodb-mcp-server` (`search-knowledge`, vector indexes, aggregation pipelines)
- **When to Use:**
  - Building autonomous AI agent systems, tool-calling agents, multi-agent orchestrations, and fallback execution chains.
  - Designing RAG pipelines (Retrieval-Augmented Generation), hybrid search (dense vector + sparse keyword), semantic chunking, and knowledge graph queries.
  - Integrating Gemini AI Logic, multimodal inference, structured JSON outputs (Zod/Pydantic schemas), and prompt grounding.
- **Protocol:**
  - Enforce structured outputs for all LLM responses. Implement robust error handling, grounding verification, and context window optimization for RAG retrievals.
