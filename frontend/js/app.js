/* ============================================
   ManeMentor — Application Logic
   ============================================ */

// =========================================
// INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initProgressRing();
  initTimeline();
  animateStats();
});

// =========================================
// NAVIGATION
// =========================================

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  
  // Show target section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav
  document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// =========================================
// PARTICLE SYSTEM
// =========================================

function initParticles() {
  const container = document.getElementById('particles');
  const count = 30;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 1) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    container.appendChild(particle);
  }
}

// =========================================
// ANIMATED STATS
// =========================================

function animateStats() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCount(el, target) {
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, 30);
}

// =========================================
// QUIZ LOGIC
// =========================================

let currentQuestion = 1;
const totalQuestions = 5;

function nextQuestion() {
  const currentQ = document.querySelector(`.quiz-question[data-q="${currentQuestion}"]`);
  const selected = currentQ.querySelector('input:checked');
  
  if (!selected) {
    // Briefly shake the options to hint they need to select
    const options = currentQ.querySelector('.options');
    options.style.animation = 'none';
    options.offsetHeight; // Trigger reflow
    options.style.animation = 'shake 0.5s ease';
    return;
  }
  
  if (currentQuestion < totalQuestions) {
    currentQuestion++;
    updateQuizUI();
  } else {
    submitQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    updateQuizUI();
  }
}

function updateQuizUI() {
  // Show current question
  document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
  document.querySelector(`.quiz-question[data-q="${currentQuestion}"]`).classList.add('active');
  
  // Update progress
  const progress = (currentQuestion / totalQuestions) * 100;
  document.getElementById('quizProgressBar').style.width = progress + '%';
  document.getElementById('quizProgressText').textContent = `Question ${currentQuestion} of ${totalQuestions}`;
  
  // Update buttons
  document.getElementById('prevBtn').disabled = currentQuestion === 1;
  document.getElementById('nextBtn').textContent = currentQuestion === totalQuestions ? 'Get Results →' : 'Next →';
}

async function submitQuiz() {
  const answers = [];
  for (let i = 1; i <= totalQuestions; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(selected ? parseInt(selected.value) : 0);
  }
  
  try {
    const res = await fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    showResults(data);
  } catch (err) {
    // Offline fallback — compute locally
    const score = answers.reduce((a, b) => a + b, 0);
    const stages = {
      stage1: {
        name: "Stage 1 – Early Thinning",
        description: "Minor hair fall, slight thinning around the temples. This is the best time to act.",
        recommendedKit: "Stage 1 Hairfall Kit",
        kitContents: ["Biotin Hair Gummies (60 count)", "Anti-Hairfall Shampoo (200ml)", "Scalp Serum with Redensyl (50ml)"],
        timeline: "8–16 weeks for noticeable improvement",
        tips: ["Take gummies daily at the same time", "Massage scalp serum for 2 minutes before bed", "Use shampoo 3–4 times per week", "Track progress with weekly photos"]
      },
      stage2: {
        name: "Stage 2 – Moderate Thinning",
        description: "Noticeable thinning on crown and temples, visible scalp in some areas.",
        recommendedKit: "Stage 2 Hairfall Kit",
        kitContents: ["Biotin Hair Gummies (60 count)", "Minoxidil 5% Topical Solution (60ml)", "Anti-Hairfall Shampoo (200ml)", "DHT Blocker Supplement"],
        timeline: "12–24 weeks for visible improvement",
        tips: ["Apply Minoxidil on dry scalp twice daily", "Be consistent — skipping days delays results", "Temporary shedding in weeks 2–4 is normal", "Take DHT blocker with meals"]
      },
      stage3: {
        name: "Stage 3 – Advanced Thinning",
        description: "Significant hair loss with clearly visible scalp.",
        recommendedKit: "Stage 3 Advanced Kit",
        kitContents: ["Finasteride 1mg (prescription)", "Minoxidil 5% (60ml)", "Biotin Gummies (60 count)", "Derma Roller (0.5mm)", "Anti-Hairfall Shampoo (200ml)"],
        timeline: "16–32 weeks with consistent use",
        tips: ["Consult a dermatologist before starting Finasteride", "Use derma roller once a week", "Do not apply Minoxidil right after derma rolling", "Patience is key for advanced stages"]
      }
    };
    
    let stage = score <= 8 ? stages.stage1 : score <= 15 ? stages.stage2 : stages.stage3;
    showResults({ stage, score });
  }
}

function showResults(data) {
  const { stage } = data;
  
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('resultsContainer').classList.remove('hidden');
  
  document.getElementById('resultsBadge').textContent = stage.name.split('–')[0].trim();
  document.getElementById('resultsTitle').textContent = stage.name;
  document.getElementById('resultsDesc').textContent = stage.description;
  document.getElementById('kitName').textContent = stage.recommendedKit;
  document.getElementById('kitTimeline').textContent = stage.timeline;
  
  const contentsEl = document.getElementById('kitContents');
  contentsEl.innerHTML = stage.kitContents.map(item => 
    `<div class="kit-item">${item}</div>`
  ).join('');
  
  const tipsEl = document.getElementById('kitTips');
  tipsEl.innerHTML = stage.tips.map(tip => `<li>${tip}</li>`).join('');
}

function resetQuiz() {
  currentQuestion = 1;
  document.querySelectorAll('.quiz-question input').forEach(i => i.checked = false);
  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('resultsContainer').classList.add('hidden');
  updateQuizUI();
}

// =========================================
// JOURNEY TRACKER
// =========================================

const milestones = [
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

function initProgressRing() {
  // Add SVG gradient definition
  const svg = document.querySelector('.progress-ring');
  if (!svg) return;
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'progressGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#6366f1');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#8b5cf6');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.insertBefore(defs, svg.firstChild);
  
  // Set gradient on fill circle
  document.getElementById('progressRingFill').setAttribute('stroke', 'url(#progressGradient)');
  
  updateJourney(1);
}

function updateJourney(week) {
  week = parseInt(week);
  
  // Update week display
  document.getElementById('currentWeekNum').textContent = week;
  
  // Update progress ring
  const percent = Math.min(100, Math.round((week / 16) * 100));
  document.getElementById('progressPercent').textContent = percent + '%';
  
  const ring = document.getElementById('progressRingFill');
  const circumference = 2 * Math.PI * 85; // r=85
  const offset = circumference - (percent / 100 * circumference);
  ring.style.strokeDashoffset = offset;
  
  // Find closest milestone
  let milestone = milestones[0];
  for (let m of milestones) {
    if (m.week <= week) milestone = m;
    else break;
  }
  
  // Update milestone card
  document.getElementById('milestoneIcon').textContent = milestone.icon;
  document.getElementById('milestoneTitle').textContent = milestone.title;
  document.getElementById('milestoneMessage').textContent = milestone.message;
  document.querySelector('.tip-text').textContent = milestone.tip;
  
  // Update timeline
  updateTimeline(week);
  
  // Check symptoms
  checkSymptoms();
}

function initTimeline() {
  const timeline = document.getElementById('journeyTimeline');
  if (!timeline) return;
  
  timeline.innerHTML = milestones.map(m => `
    <div class="timeline-item" data-week="${m.week}">
      <div class="timeline-dot">${m.icon}</div>
      <div class="timeline-week">Week ${m.week}</div>
      <div class="timeline-title">${m.title}</div>
      <div class="timeline-desc">${m.message}</div>
    </div>
  `).join('');
}

function updateTimeline(currentWeek) {
  document.querySelectorAll('.timeline-item').forEach(item => {
    const itemWeek = parseInt(item.dataset.week);
    item.classList.remove('active', 'completed');
    
    if (itemWeek < currentWeek) {
      item.classList.add('completed');
    } else if (itemWeek <= currentWeek) {
      item.classList.add('active');
    }
  });
}

// =========================================
// SYMPTOM CHECKER
// =========================================

function checkSymptoms() {
  const week = parseInt(document.getElementById('weekSlider').value);
  const checked = Array.from(document.querySelectorAll('.symptom-option input:checked')).map(i => i.value);
  const container = document.getElementById('alertsContainer');
  container.innerHTML = '';
  
  if (checked.includes('increased_shedding')) {
    if (week >= 2 && week <= 4) {
      container.innerHTML += `
        <div class="alert alert-info">
          <h5>✅ Shedding is Normal Right Now</h5>
          <p>Increased shedding in weeks 2–4 is a well-documented part of the treatment cycle. Old, weak hairs are making room for new, stronger growth. This typically subsides by week 5. Think of it like pruning a plant — it looks worse before it gets better!</p>
        </div>
      `;
    } else if (week > 5) {
      container.innerHTML += `
        <div class="alert alert-warning">
          <h5>⚠️ Extended Shedding — Consider Getting Help</h5>
          <p>If you're still experiencing significant shedding after week 5, we recommend consulting with the Man Matters support team or a dermatologist for personalized guidance. This may indicate a need to adjust your treatment approach.</p>
        </div>
      `;
    }
  }
  
  if (checked.includes('no_change') && week >= 4 && week <= 8) {
    container.innerHTML += `
      <div class="alert alert-info">
        <h5>⏳ Patience — It's Working Beneath the Surface</h5>
        <p>Hair grows approximately 1cm per month. The treatment is working on your follicles even though changes aren't visible yet. Most users start seeing noticeable results between weeks 8–12. Take weekly photos to spot subtle improvements that are hard to notice day-to-day.</p>
      </div>
    `;
  }
  
  if (checked.includes('new_growth')) {
    container.innerHTML += `
      <div class="alert alert-info">
        <h5>🎉 Great News — New Growth Detected!</h5>
        <p>Baby hairs are a fantastic sign that the treatment is working! These fine new hairs will gradually thicken over the coming weeks. Keep up your routine — consistency at this stage is crucial for these new hairs to reach their full potential.</p>
      </div>
    `;
  }
  
  if (checked.includes('less_shedding')) {
    container.innerHTML += `
      <div class="alert alert-info">
        <h5>📉 Reduced Shedding — You're On Track!</h5>
        <p>Less hair shedding is one of the first positive signs. Your treatment is stabilizing your hair follicles and reducing the hair fall cycle. Keep going — fuller, stronger hair is on its way!</p>
      </div>
    `;
  }
}

// =========================================
// ADHERENCE TRACKER
// =========================================

function toggleDay(btn) {
  btn.classList.toggle('active');
  updateAdherence();
}

function updateAdherence() {
  const total = 7;
  const active = document.querySelectorAll('.day-btn.active').length;
  const percent = Math.round((active / total) * 100);
  
  document.getElementById('adherenceFill').style.width = percent + '%';
  
  let message = '';
  if (percent === 0) message = 'Mark the days you used your kit this week';
  else if (percent < 50) message = `${percent}% adherence — Try to be more consistent for better results`;
  else if (percent < 85) message = `${percent}% adherence — Good effort! Aim for 85%+ for optimal results`;
  else if (percent < 100) message = `${percent}% adherence — Excellent! You're in the sweet spot! 💪`;
  else message = '100% adherence — Perfect week! Your consistency will pay off! 🏆';
  
  document.getElementById('adherenceText').textContent = message;
}

// =========================================
// AI CHAT
// =========================================

let isWaitingForReply = false;

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message || isWaitingForReply) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  autoResize(input);
  
  // Show typing indicator
  isWaitingForReply = true;
  document.getElementById('sendBtn').disabled = true;
  const typingId = showTypingIndicator();
  
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        context: {
          currentWeek: parseInt(document.getElementById('weekSlider')?.value || 1)
        }
      })
    });
    const data = await res.json();
    removeTypingIndicator(typingId);
    addChatMessage(data.reply, 'bot');
  } catch (err) {
    removeTypingIndicator(typingId);
    // Offline fallback
    const reply = getOfflineReply(message);
    addChatMessage(reply, 'bot');
  }
  
  isWaitingForReply = false;
  document.getElementById('sendBtn').disabled = false;
}

function sendQuickMessage(message) {
  document.getElementById('chatInput').value = message;
  sendMessage();
}

function addChatMessage(text, sender) {
  const messagesEl = document.getElementById('chatMessages');
  const avatar = sender === 'bot' ? '🤖' : '👤';
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-bubble">${formatMessage(text)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;
  
  messagesEl.appendChild(msgDiv);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatMessage(text) {
  // Basic markdown-like formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  const messagesEl = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot';
  typingDiv.id = id;
  typingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="message-bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;
  
  messagesEl.appendChild(typingDiv);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function getOfflineReply(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('shed') || lower.includes('falling') || lower.includes('hair fall')) {
    return "Temporary shedding in weeks 2–4 is completely normal and actually a positive sign! It means the treatment is working — old, weak hairs are making room for new, stronger growth. This typically subsides by week 5. If shedding persists beyond that, I'd recommend reaching out to the Man Matters support team for personalized advice. Stay consistent with your routine! 💪";
  }
  if (lower.includes('how long') || lower.includes('result') || lower.includes('when')) {
    return "For Stage 1 Hairfall Kit, most users notice reduced hair fall by weeks 8–10 and visible improvement by week 12–16. Remember, hair grows about 1cm per month, so patience is key! Take weekly photos to track subtle progress that's hard to notice day-to-day. The most important factor is consistency — try not to skip days. 📈";
  }
  if (lower.includes('stage') || lower.includes('which kit') || lower.includes('assess')) {
    return "Use our Stage Assessment tool (the Assessment tab) to determine your hair loss stage. Answer the 5 quick questions honestly, and we'll recommend the right kit for your situation. Each stage has a specifically formulated kit — using the wrong one means either under-treating or over-treating. Getting the right stage match is crucial for best results! 🎯";
  }
  if (lower.includes('side effect') || lower.includes('safe')) {
    return "Stage 1 Kit (gummies, shampoo, serum) is generally very well-tolerated with no significant side effects reported. Stages 2 and 3 include Minoxidil and potentially Finasteride, which can have side effects — always consult a dermatologist before starting those. The temporary shedding in weeks 2–4 is not a side effect but a normal part of the treatment cycle. ✅";
  }
  if (lower.includes('skip') || lower.includes('miss') || lower.includes('forgot')) {
    return "Missing a day occasionally won't undo your progress, but consistency is the #1 factor for results. If you find yourself forgetting, try:\n\n1) Setting a daily phone alarm\n2) Keeping products next to something you use daily (like your toothbrush)\n3) Using our built-in adherence tracker in the Journey tab\n\nTry to maintain at least 85% adherence for optimal results! ⏰";
  }
  if (lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
    return "A balanced diet supports hair health! Focus on:\n\n🥚 **Protein** — eggs, fish, lentils\n🥬 **Iron** — spinach, red meat\n🥜 **Zinc** — nuts, seeds\n🍠 **Biotin** — eggs, sweet potatoes\n🐟 **Omega-3s** — fish, walnuts\n\nStay hydrated, manage stress, and get 7–8 hours of sleep. These lifestyle factors work alongside your kit for the best results. 🥗";
  }
  
  return "I'm ManeMentor, your AI hair care companion! I can help you with:\n\n🔬 Understanding your hair loss stage\n📊 Tracking your treatment progress\n😟 Managing shedding concerns\n⏰ Optimizing your routine\n💊 Product questions\n\n**Tip:** For full AI-powered responses, add your Groq API key in the .env file. What would you like to know? 🧔";
}

// =========================================
// SHAKE ANIMATION (for quiz validation)
// =========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

