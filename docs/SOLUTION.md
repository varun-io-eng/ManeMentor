# ManeMentor — Solution Explanation

## How the App Solves the Problem

ManeMentor is a browser-based, AI-powered companion for customers using Man Matters' hair care kits. It directly addresses the core problem uncovered in customer research: **customers lack structured guidance, progress visibility, and real-time support during their hair care journey.**

### The Journey Without ManeMentor
1. Customer buys a kit → uses it for 2–3 weeks → shedding starts → panics → skips doses → sees no results by week 5 → gives up → blames product

### The Journey With ManeMentor
1. Customer buys a kit → takes Stage Assessment → starts Journey Tracker → gets proactive shedding warning at week 2 → sees progress milestones → chats with AI coach for reassurance → maintains 90%+ adherence → sees results at week 10–12 → reorders with smart reminders → stays on track

## Feature Breakdown

### 1. Smart Stage Assessment
- 5-question guided quiz
- Determines Stage 1, 2, or 3 based on hair loss severity
- Recommends the exact kit with detailed contents
- Provides expected timeline and pro tips
- **Solves**: Stage confusion (Customer 4's pain point)

### 2. Journey Tracker
- Interactive week slider (1–16 weeks)
- Animated progress ring showing completion percentage
- Week-specific milestone cards with messages and tips
- **Solves**: Lack of progress visibility (Customers 2, 3's pain points)

### 3. Proactive Shedding Alerts
- Symptom checker with contextual alerts
- Automatically normalizes shedding during weeks 2–4
- Warns about extended shedding after week 5
- Science-based explanations ("Think of it like pruning a plant")
- **Solves**: Shedding anxiety (Customer 3's pain point)

### 4. Adherence Tracker
- 7-day check-in grid
- Weekly adherence percentage with progress bar
- Encouraging messages at different adherence levels
- **Solves**: Poor adherence (Customer 1's pain point)

### 5. AI Hair Coach (Groq-Powered)
- Instant, contextual answers 24/7
- Quick-action buttons for common concerns
- Knowledge of all Man Matters products and timelines
- Empathetic, science-based tone
- Offline fallback with intelligent pre-built responses
- **Solves**: All pain points — acts as always-available support

### 6. Smart Refill Reminders (API)
- Calculate optimal refill dates
- 5-day advance notifications
- Prevent supply gaps
- **Solves**: Delivery delays (Customer 5's pain point)

## Technical Decisions

| Decision | Reasoning |
|----------|-----------|
| **Single Page App** | No page reloads, smooth experience, feels like a native app |
| **Dark theme** | Modern, premium feel matching Man Matters' brand aesthetics |
| **Groq (LLaMA 3.1)** | Ultra-fast inference (~100ms), cost-effective, good enough for guidance |
| **Offline fallback** | App works without API key for evaluation/demo purposes |
| **Vanilla JS** | No framework overhead, instant loading, simple deployment |
| **Node.js backend** | Simple, lightweight, easy to deploy anywhere |

## AI Tools Used
- **Antigravity (Claude)** — Code generation, architecture design, and full-stack development
- **Groq API** — Powers the real-time AI chat assistant within the app

---

*This solution was built as Part 2 of the Mosaic Brands application, directly addressing the problem identified in Part 1's customer research.*

