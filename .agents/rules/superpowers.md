# Autonomous Tool Execution Protocol (Superpowers & MCP Orchestration)

Antigravity MUST actively and automatically leverage its installed tools based on the specific operational use case:

---

### 1. Complex Reasoning, Architecture & Multi-Step Tasks
**Tool:** `sequential-thinking` (`@modelcontextprotocol/server-sequential-thinking`)
- **When to Use:**
  - Architecting new features, full-stack systems, state management refactors, or algorithms.
  - Deep-dive debugging when root causes are non-obvious or involve multi-file race conditions.
  - Planning multi-phase workflows with hypothesis testing and backtracking.
- **Protocol:**
  - Break complex problems down into step-by-step sequential hypotheses before committing edits.

---

### 2. Persistent Cross-Session Memory & Architectural Knowledge
**Tool:** `memory` (`@modelcontextprotocol/server-memory`)
- **When to Use:**
  - Establishing project-wide conventions, user preferences, API key locations, architectural patterns, and user directives.
  - Recalling previously agreed decisions across past conversations.
- **Protocol:**
  - Save key architectural decisions, conventions, and reusable entities into the local knowledge graph.

---

### 3. UI/UX Design, Components & Vibe Coding
**Tools:** `shadcn` (`shadcn@latest mcp`), `21st` (`@21st-dev/cli@latest mcp`), `StitchMCP`
- **When to Use:**
  - Creating landing pages, dashboards, modern components, interactive modals, or design systems.
  - Needing animated, accessible components (Radix primitives, Lucide icons, Tailwind styling, Framer Motion).
- **Protocol:**
  - Query official component registries for exact code, props, and dependencies rather than guessing or fabricating boilerplate.

---

### 4. Browser Inspection, Visual Quality & Performance Auditing
**Tool:** `chrome-devtools` (`chrome-devtools-mcp@latest`)
- **When to Use:**
  - Testing web applications in real browsers.
  - Inspecting DOM trees, computed styles, layout shifts, and console errors.
  - Running Lighthouse audits, LCP/CWV performance optimization, and accessibility (a11y) checks.
- **Protocol:**
  - Verify UI states visually with snapshots and screenshots before declaring tasks complete.

---

### 5. Official Documentation & Library Lookups
**Tool:** `context7`
- **When to Use:**
  - Any time modern APIs, libraries, or SDKs are used (React 19, Next.js, Vite, Tailwind, MongoDB, etc.).
- **Protocol:**
  - Fetch up-to-date documentation via Context7 before writing code to prevent deprecated syntax errors.
