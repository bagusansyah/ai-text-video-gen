# 🎬 AI Video Director & Storyboard Generator

An intelligent AI-powered platform designed to help content creators architect professional video scripts, detailed scene-by-scene breakdowns, and storyboards instantly. 

Built with a focus on speed, stability, and production-ready output.

## 🔗 Submission Links
- **Live Demo:** [https://ai-text-video-gen.vercel.app](https://ai-text-video-gen.vercel.app)
- **Video Walkthrough:** [https://youtu.be/HceWrtg4QL0](https://youtu.be/HceWrtg4QL0)
- **Repository:** [https://github.com/bagusansyah/ai-text-video-gen](https://github.com/bagusansyah/ai-text-video-gen)

### 👤 Reviewer Credentials (Dummy Account)
- **Email:** `yey022537@gmail.com`
- **Password:** `Haloinipassword!`

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router) with Turbopack
- **Authentication:** Clerk Authentication (Secure & Scalable)
- **AI Engine:** Llama 3.1 via Groq Cloud (Ultra Fast Inference)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **UI/UX:** Tailwind CSS + Shadcn/UI + Lucide Icons
- **Deployment:** Vercel

---

## ✨ Key Features

- **AI Storyboarding:** Generates a detailed script including visual directions and audio cues per scene.
- **Real-time Streaming:** Uses Native Fetch Stream Reader to deliver AI responses character-by-character for zero perceived latency.
- **Content Templates:** One-click presets for common use cases like Digital Dakwah, Sales Promos, and Tech Education.
- **History Management:** Full CRUD integration to save, view, and manage previous generations.
- **Export System:** One-click export to `.txt` format, optimized for teleprompters and production team sharing.

---

## 🧠 Technical Decisions (The "Why")

### 1. The Strategic Pivot: Storyboard vs. Video Rendering
Instead of using unstable and costly video rendering APIs (MP4), I prioritized a **high-fidelity storyboard approach**. This provides creators with a structured "Production Blueprint" that is 100% stable and fast, which is often more valuable in a real-world filming workflow.

### 2. Native Streaming Implementation
I avoided high-level AI SDK hooks and implemented a **Native Fetch Stream Reader**. This prevents "silent failure" bugs and allows for granular control over the UI state during long AI generations.

### 3. Architecture & Security
By using **Clerk** and **Middleware**, I ensured that the AI generation routes and Database access are strictly protected, preventing unauthorized API usage.

---

## 🛠️ Local Development

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/bagusansyah/ai-text-video-gen.git](https://github.com/bagusansyah/ai-text-video-gen.git)
cd ai-text-video-gen
