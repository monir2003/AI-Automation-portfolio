/* =============================================
   NEXUSAI — Premium AI Automation Portfolio
   script.js
   ============================================= */

"use strict";

// ===== CONFIGURATION =====
const WEBHOOK_URL = "https://your-n8n-webhook-url"; // Replace with your n8n webhook URL

// ===== LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("fade-out");
    document.body.style.overflow = "visible";
    setTimeout(() => { if (loader) loader.remove(); }, 600);
  }, 2000);
});

// ===== CURSOR GLOW =====
(function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
})();

// ===== PARTICLES =====
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 130, 246, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => { resize(); createParticles(); });
})();

// ===== NAVBAR =====
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-link");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Scroll behavior
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
    updateActiveLink();
  }, { passive: true });

  // Active link
  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  // Hamburger
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("mobile-open");
  });

  // Close on nav link click
  navLinks.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("mobile-open");
    }
  });
})();

// ===== TYPING EFFECT =====
(function initTyping() {
  const target = document.getElementById("typing-target");
  if (!target) return;
  const phrases = [
    "AI Automation",
    "Smart Chatbots",
    "Voice Agents",
    "n8n Workflows",
    "WhatsApp AI",
    "Lead Gen Systems",
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      target.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        setTimeout(() => { deleting = true; type(); }, 1800);
        return;
      }
    } else {
      target.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  type();
})();

// ===== SCROLL REVEAL =====
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Animate skill bars when about section enters view
          if (entry.target.classList.contains("about-content")) {
            setTimeout(() => {
              document.querySelectorAll(".skill-fill").forEach((fill) => {
                fill.classList.add("animate");
              });
            }, 300);
          }
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
})();

// ===== STAT COUNTER ANIMATION =====
(function initCounters() {
  const statCards = document.querySelectorAll(".stat-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const numEl = entry.target.querySelector(".stat-num");
        if (!numEl || numEl.dataset.animated) return;
        numEl.dataset.animated = "true";
        const target = parseInt(numEl.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function update(time) {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          numEl.textContent = Math.round(ease * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    },
    { threshold: 0.5 }
  );
  statCards.forEach((card) => observer.observe(card));
})();

// ===== PORTFOLIO FILTER + MODAL =====
(function initPortfolio() {
  const filterBtns = document.querySelectorAll(".pf-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  const modal = document.getElementById("portfolio-modal");
  const modalClose = document.getElementById("modal-close");

  // Filters
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === "all" || cat === filter;
        card.style.display = show ? "" : "none";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        if (show) {
          setTimeout(() => {
            card.style.transition = "opacity 0.4s, transform 0.4s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        }
      });
    });
  });

  // Modal
  function openModal(card) {
    document.getElementById("modal-title").textContent = card.dataset.title;
    document.getElementById("modal-desc").textContent = card.dataset.desc;
    document.getElementById("modal-result").textContent = card.dataset.result;

    const tagsContainer = document.getElementById("modal-tags");
    tagsContainer.innerHTML = "";
    card.dataset.tags.split(",").forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag.trim();
      tagsContainer.appendChild(span);
    });

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    const viewBtn = card.querySelector(".pc-view-btn");
    if (viewBtn) viewBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal(card); });
  });

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  const modalCtaBtn = document.getElementById("modal-cta-btn");
  if (modalCtaBtn) {
    modalCtaBtn.addEventListener("click", () => {
      closeModal();
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();

// ===== TESTIMONIAL SLIDER =====
(function initSlider() {
  const track = document.getElementById("testimonial-track");
  const dotsContainer = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  let current = 0;
  let autoInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsContainer.querySelectorAll(".slider-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  prevBtn.addEventListener("click", () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener("click", () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goTo(current + 1), 4000);
  }
  resetAuto();
  window.addEventListener("resize", () => goTo(current));
})();

// ===== CONTACT FORM =====
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-text");
  const submitLoading = document.getElementById("submit-loading");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const details = document.getElementById("cf-details").value.trim();
    const budget = document.getElementById("cf-budget").value;

    if (!name || !email || !details || !budget) {
      formError.classList.remove("hidden");
      setTimeout(() => formError.classList.add("hidden"), 3000);
      return;
    }

    submitText.classList.add("hidden");
    submitLoading.classList.remove("hidden");
    submitBtn.disabled = true;

    // Simulate API call (replace with actual endpoint)
    await new Promise((res) => setTimeout(res, 1500));

    submitText.classList.remove("hidden");
    submitLoading.classList.add("hidden");
    submitBtn.disabled = false;
    formSuccess.classList.remove("hidden");
    form.reset();
    setTimeout(() => formSuccess.classList.add("hidden"), 5000);
  });

  // Floating label fix for select
  const select = document.getElementById("cf-budget");
  const selectLabel = document.querySelector(".select-label");
  if (select && selectLabel) {
    select.addEventListener("change", () => {
      selectLabel.style.transform = select.value ? "translateY(-8px) scale(0.8)" : "";
      selectLabel.style.color = select.value ? "var(--blue)" : "";
    });
  }
})();

// ===== AI CHAT WIDGET =====
(function initChatWidget() {
  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("chat-close-btn");
  const popup = document.getElementById("chat-popup");
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");
  const suggestionsEl = document.getElementById("chat-suggestions");
  const notification = document.getElementById("chat-notification");
  const openIcon = document.querySelector(".chat-icon-open");
  const closeIcon = document.querySelector(".chat-icon-close");

  if (!toggleBtn) return;

  let chatHistory = [];
  let isOpen = false;
  let initialized = false;

  // Fallback responses
  const fallbackResponses = {
    default: [
      "Great question! I specialize in AI automation systems that can transform your business operations. Would you like to tell me more about what you're looking to automate?",
      "I can help with that! Whether it's chatbots, workflow automation, voice agents, or CRM integrations — I've built them all. What's your main business challenge right now?",
      "Absolutely! My AI systems have helped clients reduce costs by 40–70% and automate thousands of manual tasks. What does your current process look like?",
      "That's exactly the kind of challenge I solve. Let me map out a custom AI automation strategy for your business. Want to book a free strategy call?",
    ],
    services: "I offer a full stack of AI automation services: AI Chat Agents, Voice Agents, WhatsApp automation, lead generation pipelines, CRM integrations, workflow automation with n8n, and more. Which area interests you most?",
    pricing: "My projects range from $2,000 for simple chatbots to $50,000+ for enterprise automation systems. The best way to get accurate pricing is a free 30-minute strategy call where I'll scope your exact needs. Want to book one?",
    call: "I'd love to chat! You can book a free strategy call via the contact form on this page. I have slots available this week — Monday through Friday, 9am–6pm UTC.",
    portfolio: "I've built AI systems across many industries — e-commerce WhatsApp bots that drove $180k in pipeline, lead gen systems generating 340% more qualified leads, and voice agents with 38% booking rates. Check out the Portfolio section for case studies!",
  };

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(text, role) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;

    const time = document.createElement("div");
    time.className = "chat-time";
    time.textContent = getTime();

    msg.appendChild(bubble);
    msg.appendChild(time);
    messagesEl.appendChild(msg);
    scrollToBottom();
    chatHistory.push({ role: role === "bot" ? "assistant" : "user", content: text });
    return msg;
  }

  function addTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "chat-msg bot";
    indicator.id = "typing-msg";
    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    indicator.appendChild(typing);
    messagesEl.appendChild(indicator);
    scrollToBottom();
    return indicator;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getFallback(message) {
    const lower = message.toLowerCase();
    if (lower.includes("service") || lower.includes("offer") || lower.includes("what") && lower.includes("do"))
      return fallbackResponses.services;
    if (lower.includes("price") || lower.includes("cost") || lower.includes("pric") || lower.includes("budget"))
      return fallbackResponses.pricing;
    if (lower.includes("call") || lower.includes("book") || lower.includes("meet") || lower.includes("talk"))
      return fallbackResponses.call;
    if (lower.includes("portfolio") || lower.includes("project") || lower.includes("work") || lower.includes("example"))
      return fallbackResponses.portfolio;
    const arr = fallbackResponses.default;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ===== n8n / AI Integration =====
  async function sendToAI(message) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          chatHistory,
          timestamp: new Date().toISOString(),
          source: "website-chat-widget",
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // Handle multiple response formats (n8n, OpenAI, custom)
      return (
        data?.output ||
        data?.message ||
        data?.response ||
        data?.choices?.[0]?.message?.content ||
        data?.content?.[0]?.text ||
        getFallback(message)
      );
    } catch (err) {
      // Webhook not configured — use fallback
      return getFallback(message);
    }
  }

  async function handleSend(text) {
    const message = (text || inputEl.value).trim();
    if (!message) return;

    inputEl.value = "";
    suggestionsEl.style.display = "none";
    addMessage(message, "user");

    const typingEl = addTypingIndicator();
    const minDelay = new Promise((res) => setTimeout(res, 900));
    const aiPromise = sendToAI(message);

    const [aiResponse] = await Promise.all([aiPromise, minDelay]);
    typingEl.remove();
    addMessage(aiResponse, "bot");
  }

  // Open / Close
  function openChat() {
    isOpen = true;
    popup.classList.remove("hidden");
    openIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
    notification.style.display = "none";

    if (!initialized) {
      initialized = true;
      setTimeout(() => {
        addMessage("👋 Hi there! I'm the NexusAI assistant. Ask me about services, pricing, or how AI automation can help your business.", "bot");
      }, 400);
    }
    setTimeout(() => inputEl.focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    popup.classList.add("hidden");
    openIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }

  toggleBtn.addEventListener("click", () => { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener("click", closeChat);

  sendBtn.addEventListener("click", () => handleSend());
  inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSend(); });

  // Quick suggestion buttons
  document.querySelectorAll(".chat-suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleSend(btn.textContent.replace(/^[^\w]+/, "").trim());
    });
  });

  // Show notification after delay
  setTimeout(() => {
    if (!isOpen) notification.style.display = "flex";
  }, 5000);
})();

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== PARALLAX on hero orbs =====
(function initParallax() {
  const orbs = document.querySelectorAll(".hero-orb");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.1 + i * 0.05;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
})();

// ===== GLOW BORDER ANIMATION on service cards =====
(function initCardGlow() {
  document.querySelectorAll(".service-card, .portfolio-card, .sol-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
})();
