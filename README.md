# 🧔 ManeMentor — AI-Powered Hair Care Journey Companion

> Built for **Man Matters** (Mosaic Brands) | Powered by **Groq AI**

## 🎯 What is ManeMentor?

ManeMentor is a consumer-facing web application that solves the #1 problem uncovered through customer research: **customers lack structured guidance, progress visibility, and real-time support during their hair care journey** — leading to anxiety, poor adherence, and premature product abandonment.

## 🔍 The Problem (from Part 1 Research)

After speaking with **5 real customers** of Man Matters' **Stage 1 Hairfall Kit**, four interconnected pain points emerged:

| Pattern | Description | Customers |
|---------|-------------|-----------|
| **Journey Anxiety** | Shedding panic in weeks 2–4, no progress visibility | C1, C2, C3 |
| **Poor Adherence** | Forgetting doses on busy days, breaking routine | C1, C2 |
| **Stage Confusion** | Can't self-assess hair loss stage, fear of wrong kit | C4 |
| **Delivery Gaps** | Late refills break treatment consistency | C5 |

**Root Cause**: Journey anxiety is the multiplier — it amplifies every other problem. When customers can't see if treatment works, they skip doses, panic at normal shedding, and quit before results appear.

## ✨ The Solution

ManeMentor addresses all four pain points through a single, unified experience:

### Features

1. **🔬 Smart Stage Assessment** — 5-question quiz to determine hair loss stage with clear explanations
2. **📊 Week-by-Week Journey Tracker** — Progress ring, milestone cards, proactive shedding alerts
3. **🤖 AI Hair Coach** — Groq-powered chat for instant, personalized guidance
4. **✅ Adherence Tracker** — Daily check-in with weekly scores and encouragement
5. **⚠️ Proactive Shedding Alerts** — Warns about shedding BEFORE it happens
6. **🔔 Smart Refill Reminders** — Schedule-based reminders 5 days before supply runs out

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure your Groq API key
# Edit the .env file and replace 'your_groq_api_key_here' with your actual key

# 3. Start the server
npm start

# 4. Open in browser
# http://localhost:3000
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI chat | Yes (for AI chat) |
| `PORT` | Server port (default: 3000) | No |

> **Note**: The app works without a Groq API key — the AI chat falls back to pre-built intelligent responses.

## 📁 Project Structure

```
xomoplete/
├── .env                    # Environment variables (Groq API key)
├── package.json            # Node.js dependencies
├── README.md               # This file
│
├── backend/
│   └── server.js           # Express.js API server + Groq integration
│
├── frontend/
│   ├── index.html          # Main SPA (Single Page Application)
│   ├── css/
│   │   └── styles.css      # Premium glassmorphic design system
│   ├── js/
│   │   └── app.js          # Client-side application logic
│   └── assets/             # Static assets
│
├── docs/
│   └── SOLUTION.md         # Detailed solution explanation
│
└── report/
    └── RESEARCH_REPORT.md  # Part 1: Customer research & insights
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Custom Design System), Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **AI** | Groq API (LLaMA 3.1 8B Instant) |
| **Design** | Glassmorphic dark theme, Space Grotesk + Inter fonts |

## 🎨 Design Highlights

- **Dark glassmorphic theme** with animated gradient background
- **Floating particle system** for visual depth
- **Progress ring animation** with SVG gradients
- **Smooth page transitions** with fade-in animations
- **Mobile-responsive** with hamburger menu
- **Micro-interactions** on hover, selection, and click
- **Professional color palette** (indigo → violet gradient)

## 📊 How It Solves Each Pain Point

| Pain Point | ManeMentor Feature | How It Helps |
|------------|-------------------|--------------|
| Shedding anxiety | Proactive alerts + AI coach | Warns users BEFORE shedding phase, normalizes it with science |
| Poor adherence | Day tracker + weekly scores | Visual accountability with encouraging feedback |
| Stage confusion | Smart quiz + clear explanations | Guided assessment with reasoning behind recommendations |
| Delivery delays | Refill reminder API | Proactive 5-day-early reminders prevent gaps |
| No progress visibility | Journey tracker + milestone map | Week-by-week expectations with progress ring |

## 🤖 AI Integration

The AI chat uses **Groq's LLaMA 3.1 8B Instant** model with a carefully crafted system prompt that:
- Has deep knowledge of Man Matters products and treatment timelines
- Provides empathetic, science-based guidance
- Never diagnoses medical conditions
- Recommends professional help for serious concerns
- Falls back to intelligent pre-built responses when offline

## 📝 License

MIT License — Built as a technology-driven solution for Mosaic Brands application.

---

**Built with ❤️ using AI assistance (Antigravity / Claude)**

