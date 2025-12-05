# ✅ **1. DEVPOST-READY README (Highly Polished)**

Use this in your **Devpost “Built With” + Project Page Description”** or as your GitHub README optimized for hackathon judges.

---

# 📺 **Teletext Universe**

### *A forgotten technology, resurrected with AI.*

---

## 🧠 **What It Does**

Teletext Universe brings back the classic 1980s teletext system — CRT glow, scanlines, glitch slices, pixel fonts, and numeric page navigation — but powered completely by modern AI.

Users can type classic teletext page numbers to access:

* **101 — AI Headlines** (Gemini converts real news into teletext-style summaries)
* **102 — Weather** (live data from WeatherAPI via secure serverless proxy)
* **105 — Pixel Art** (Gemini generates 8×8 pixel art grids)
* **199 — Teletext Assistant** (AI replies formatted like old teletext pages)

All rendered on a fully recreated CRT-style interface.

---

## 💡 **Inspiration**

Teletext was one of the earliest public information systems, and its crude, blocky, low-bandwidth aesthetic feels iconic today.

When exploring Kiroween’s *Resurrection* theme, the question became:

> **What if teletext never died — and evolved with AI instead?**

Teletext Universe is the answer: a blend of nostalgia and intelligence.

---

## 🛠️ **How I Built It**

I used **Kiro** as my development partner through two workflows:

### **Vibe Coding**

I began with creative descriptions:
*“Make it look like a CRT. Add scanlines, glow, glitch slices. Old teletext colors.”*
Kiro rapidly turned this into starter UI, components, filters, palettes, and mockups.

### **Spec-Driven Development**

Once the direction was clear, I wrote detailed feature specs.
Kiro generated:

* Full React + Vite structure
* Page navigation engine
* TeletextViewport & layout logic
* Serverless API proxies
* Pixel art renderer
* SVG assets (favicon, title bar, etc.)

This kept the project stable, clean, and consistent.

### **Steering Documents**

A structured visual spec ensured every Kiro output matched the teletext theme —
colors, spacing, CRT effects, typography, interaction rules.

---

## 🧩 **Tech Stack**

**Frontend:** React (Vite), TypeScript, CSS CRT filters, SVG assets
**Backend:** Vercel Serverless Functions
**APIs:** Google Gemini 1.5 Flash, WeatherAPI.com
**Tools:** Kiro, GitHub, Figma-ready SVG generation

---

## ✨ **Key Features**

### 📰 **AI Headlines**

Gemini reformats real news into strict teletext-style block text.

### ☁️ **Live Weather**

Serverless proxy ensures keys remain secure, even on client-side navigation.

### 🎨 **Pixel Art Generator**

Gemini produces structured color grids interpreted as pixel art.

### 🤖 **Teletext Chat Assistant**

Ask anything — responses appear in crisp retro teletext rows.

### 📺 **Authentic CRT Experience**

Scanlines, glow, vignette, glitch slices, pixel fonts, page buffering —
all recreated to mimic real teletext broadcasts.

---

## 🚀 **Challenges**

* Recreating realistic CRT distortion in CSS/SVG
* Formatting LLM outputs into strict teletext row constraints
* Building accurate numeric page navigation logic (buffered input)

---

## 🎉 **What I’m Proud Of**

* Authentic CRT look with modern web tech
* AI features integrated seamlessly into a retro interface
* Teletext “resurrected” using only free developer tools

---

## 📣 **What’s Next**

* Multi-page content caching
* Pixel-art animation mode
* On-device LLM via Gemini Nano
* User-generated teletext pages

---

## 📜 **License**

MIT

---
