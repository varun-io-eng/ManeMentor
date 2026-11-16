require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =========================================
// HAIR ASSESSMENT DATA
// =========================================
const stageData = {
  stage1: {
    name: "Stage 1 – Early Thinning",
    description: "Minor hair fall, slight thinning around the temples. This is the best time to act.",
    severity: "Mild",
    recommendedKit: "Stage 1 Hairfall Kit",
    kitContents: [
      "Biotin Hair Gummies (60 count)",
      "Anti-Hairfall Shampoo (200ml)",
      "Scalp Serum with Redensyl (50ml)"
    ],
    timeline: "8–16 weeks for noticeable improvement",
    tips: [
      "Take gummies daily at the same time for consistency",
      "Massage scalp serum for 2 minutes before bed",
      "Use anti-hairfall shampoo 3–4 times per week",
      "Track progress with weekly photos"
    ]
  },
  stage2: {
    name: "Stage 2 – Moderate Thinning",
    description: "Noticeable thinning on crown and temples, visible scalp in some areas.",
    severity: "Moderate",
    recommendedKit: "Stage 2 Hairfall Kit",
    kitContents: [
      "Biotin Hair Gummies (60 count)",
      "Minoxidil 5% Topical Solution (60ml)",
      "Anti-Hairfall Shampoo (200ml)",
      "DHT Blocker Supplement"
    ],
    timeline: "12–24 weeks for visible improvement",
    tips: [
      "Apply Minoxidil on dry scalp twice daily",
      "Be consistent — skipping days delays results",
      "Temporary shedding in weeks 2–4 is normal and expected",
      "Take the DHT blocker with meals"
    ]
  },
  stage3: {
    name: "Stage 3 – Advanced Thinning",
    description: "Significant hair loss with clearly visible scalp. Aggressive treatment recommended.",
    severity: "Advanced",
    recommendedKit: "Stage 3 Advanced Kit",
    kitContents: [
      "Finasteride 1mg (prescription-based)",
      "Minoxidil 5% Topical Solution (60ml)",
      "Biotin Hair Gummies (60 count)",
      "Derma Roller (0.5mm)",
      "Anti-Hairfall Shampoo (200ml)"
    ],
    timeline: "16–32 weeks with consistent use",
    tips: [
      "Consult a dermatologist before starting Finasteride",
      "Use derma roller once a week on clean scalp",
      "Do not apply Minoxidil immediately after derma rolling",
      "Patience is key — advanced stages take longer"
    ]
  }
};

const journeyMilestones = [
  { week: 1, title: "Getting Started", message: "Your hair journey begins! Focus on building the daily habit.", icon: "🌱", tip: "Set a daily alarm for your gummies and serum." },
  { week: 2, title: "Building Consistency", message: "You're building a routine. Some temporary shedding is completely normal.", icon: "📅", tip: "This shedding means the treatment is working — old weak hairs are making way for new stronger ones." },
  { week: 3, title: "Shedding Phase", message: "⚠️ You may notice more hair fall this week. Don't panic — this is a well-documented part of the treatment cycle.", icon: "🔄", tip: "Think of it like pruning a plant. The weak hairs shed to make room for healthier growth." },
  { week: 4, title: "Past the Hump", message: "The initial shedding typically subsides around now. Stay consistent!", icon: "💪", tip: "If shedding continues beyond week 5, reach out to our support team." },
  { week: 6, title: "Patience Period", message: "Hair grows ~1cm per month. The products are working beneath the surface.", icon: "⏳", tip: "Take a photo now. Compare it with your Day 1 photo to spot subtle changes." },
  { week: 8, title: "First Signs", message: "Many users start noticing reduced hair fall and baby hairs around now.", icon: "🌿", tip: "Check your pillow and shower drain — less hair there is a great sign!" },
  { week: 10, title: "Momentum Building", message: "Your hair follicles are responding. Keep the routine rock-solid.", icon: "📈", tip: "Now is NOT the time to skip doses. Consistency is everything." },
  { week: 12, title: "Visible Progress", message: "🎉 This is where most users see clear improvement. Time to celebrate!", icon: "🎯", tip: "Compare your Week 1 photo with today. You'll likely see a real difference." },
  { week: 16, title: "Strong Results", message: "Your hair is significantly stronger and fuller. The journey is paying off.", icon: "🏆", tip: "Consider setting up auto-refill so you never miss a shipment." }
];

// =========================================
// API ROUTES
// =========================================

// Stage Assessment
app.post('/api/assess', (req, res) => {
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  let score = 0;
  answers.forEach(a => { score += (a || 0); });

  let stage;
  if (score <= 8) stage = stageData.stage1;
  else if (score <= 15) stage = stageData.stage2;
  else stage = stageData.stage3;

  res.json({
    stage,
    score,
    milestones: journeyMilestones
  });
});

// Journey Progress Tracker
app.post('/api/progress', (req, res) => {
  const { currentWeek, symptoms, adherence } = req.body;

  const milestone = journeyMilestones.find(m => m.week === currentWeek) || 
                    journeyMilestones.reduce((prev, curr) => 
                      Math.abs(curr.week - currentWeek) < Math.abs(prev.week - currentWeek) ? curr : prev
                    );

  let alerts = [];
  if (symptoms && symptoms.includes('increased_shedding') && currentWeek >= 2 && currentWeek <= 4) {
    alerts.push({
      type: 'info',
      title: 'Shedding is Normal Right Now',
      message: 'Increased shedding in weeks 2–4 is a well-documented part of the treatment cycle. Old, weak hairs are making room for new, stronger growth. This typically subsides by week 5.'
    });
  }
  if (symptoms && symptoms.includes('increased_shedding') && currentWeek > 5) {
    alerts.push({
      type: 'warning',
      title: 'Extended Shedding',
      message: 'If you\'re still experiencing significant shedding after week 5, we recommend consulting with our hair care experts for personalized guidance.'
    });
  }
  if (adherence && adherence < 70) {
    alerts.push({
      type: 'warning',
      title: 'Consistency Matters',
      message: `Your adherence is at ${adherence}%. For best results, try to maintain at least 85% consistency. Set daily reminders to help build the habit.`
    });
  }

  const progressPercent = Math.min(100, Math.round((currentWeek / 16) * 100));

  res.json({
    milestone,
    alerts,
    progressPercent,
    nextMilestone: journeyMilestones.find(m => m.week > currentWeek) || null,
    encouragement: getEncouragement(currentWeek, adherence)
  });
});

// AI Chat with Groq
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return res.json({
      reply: getOfflineResponse(message),
      source: 'offline'
    });
  }

  try {
    const systemPrompt = `You are ManeMentor, an AI hair care assistant for Man Matters (a Mosaic brand). 
You help users with their hair care journey, specifically around the Stage 1/2/3 Hairfall Kits.

Key knowledge:
- Stage 1 Kit: Biotin gummies, anti-hairfall shampoo, scalp serum with Redensyl. For early thinning.
- Stage 2 Kit: Adds Minoxidil 5% and DHT blocker. For moderate thinning.
- Stage 3 Kit: Adds Finasteride (prescription) and derma roller. For advanced thinning.

Important context to share:
- Temporary shedding in weeks 2-4 is NORMAL and expected. It means the treatment is working.
- Results typically show at 8-12 weeks for Stage 1, longer for Stage 2/3.
- Consistency is crucial — skipping days delays results significantly.
- Diet, sleep, and stress management support hair health.

Current user context: ${JSON.stringify(context || {})}

Be empathetic, encouraging, and science-based. Keep answers concise but helpful. 
Never diagnose medical conditions. Recommend consulting a dermatologist for serious concerns.
Use a warm, supportive tone. You're a knowledgeable friend, not a medical professional.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      reply: completion.choices[0]?.message?.content || 'I\'m here to help with your hair care journey. Could you rephrase your question?',
      source: 'groq'
    });
  } catch (error) {
    console.error('Groq API error:', error);
    res.json({
      reply: getOfflineResponse(message),
      source: 'offline-fallback'
    });
  }
});

// Refill Reminder Setup
app.post('/api/refill-reminder', (req, res) => {
  const { startDate, kitType, frequency } = req.body;
  
  const start = new Date(startDate);
  const refillDays = frequency === 'monthly' ? 30 : 60;
  const reminders = [];
  
  for (let i = 1; i <= 6; i++) {
    const reminderDate = new Date(start);
    reminderDate.setDate(reminderDate.getDate() + (refillDays * i));
    
    // Notify 5 days before
    const notifyDate = new Date(reminderDate);
    notifyDate.setDate(notifyDate.getDate() - 5);
    
    reminders.push({
      refillNumber: i,
      orderBy: notifyDate.toISOString().split('T')[0],
      expectedDelivery: reminderDate.toISOString().split('T')[0],
      message: `Time to reorder your ${kitType}! Order by ${notifyDate.toLocaleDateString()} to ensure uninterrupted supply.`
    });
  }
  
  res.json({ reminders });
});

// =========================================
// HELPER FUNCTIONS
// =========================================

function getEncouragement(week, adherence) {
  if (week <= 2) return "Every journey starts with a single step. You're doing great! 🌟";
  if (week <= 4) return "The first month is the hardest. Stay strong — your future self will thank you! 💪";
  if (week <= 8) return "You're past the initial phase. The real magic is happening beneath the surface! ✨";
  if (week <= 12) return "Most users start seeing results around now. Keep going — you're almost there! 🚀";
  return "You've shown incredible dedication. Your consistency is paying off! 🏆";
}

function getOfflineResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('shed') || lower.includes('falling') || lower.includes('hair fall')) {
    return "Temporary shedding in weeks 2–4 is completely normal and actually a positive sign! It means the treatment is working — old, weak hairs are making room for new, stronger growth. This typically subsides by week 5. If shedding persists beyond that, I'd recommend reaching out to the Man Matters support team for personalized advice. Stay consistent with your routine! 💪";
  }
  if (lower.includes('how long') || lower.includes('result') || lower.includes('when')) {
    return "For Stage 1 Hairfall Kit, most users notice reduced hair fall by weeks 8–10 and visible improvement by week 12–16. Remember, hair grows about 1cm per month, so patience is key! Take weekly photos to track subtle progress that's hard to notice day-to-day. The most important factor is consistency — try not to skip days. 📈";
  }
  if (lower.includes('stage') || lower.includes('which kit') || lower.includes('assess')) {
    return "Use our Stage Assessment tool (the first tab in the app) to determine your hair loss stage. Answer the 5 quick questions honestly, and we'll recommend the right kit for your situation. Each stage has a specifically formulated kit — using the wrong one means either under-treating or over-treating. Getting the right stage match is crucial for best results! 🎯";
  }
  if (lower.includes('side effect') || lower.includes('safe')) {
    return "Stage 1 Kit (gummies, shampoo, serum) is generally very well-tolerated with no significant side effects reported. Stages 2 and 3 include Minoxidil and potentially Finasteride, which can have side effects — always consult a dermatologist before starting those. The temporary shedding in weeks 2–4 is not a side effect but a normal part of the treatment cycle. ✅";
  }
  if (lower.includes('skip') || lower.includes('miss') || lower.includes('forgot')) {
    return "Missing a day occasionally won't undo your progress, but consistency is the #1 factor for results. If you find yourself forgetting, try: 1) Setting a daily phone alarm, 2) Keeping products next to something you use daily (like your toothbrush), 3) Using our built-in reminder feature. Try to maintain at least 85% adherence for optimal results! ⏰";
  }
  if (lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
    return "A balanced diet supports hair health! Focus on: protein (eggs, fish, lentils), iron (spinach, red meat), zinc (nuts, seeds), biotin (eggs, sweet potatoes), and omega-3s (fish, walnuts). Stay hydrated, manage stress, and get 7–8 hours of sleep. These lifestyle factors work alongside your kit to give you the best results. 🥗";
  }
  
  return "I'm ManeMentor, your AI hair care companion! I can help you with: understanding your hair loss stage, tracking your treatment progress, managing shedding concerns, optimizing your routine, and answering questions about Man Matters products. Please add your Groq API key in the .env file for full AI-powered responses. What would you like to know? 🧔";
}

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🧔 ManeMentor is running!                  ║
  ║   → http://localhost:${PORT}                    ║
  ║                                              ║
  ║   Hair Care Journey Companion                ║
  ║   Powered by Man Matters × Groq AI           ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
  `);
});

