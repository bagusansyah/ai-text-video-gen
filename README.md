# AI Video Director & Storyboard Generator

Aplikasi berbasis AI untuk membantu konten kreator menyusun script video, breakdown adegan (scene-by-scene), dan storyboard secara otomatis.

## 🚀 Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **Auth**: Clerk Authentication
- **AI Engine**: Llama 3.1 via Groq Cloud (Ultra Fast)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **UI/UX**: Tailwind CSS + Shadcn/UI + Lucide Icons

## ✨ Fitur Utama
- **AI Storyboarding**: Generate script mendetail beserta arahan visual per adegan.
- **History Management**: Menyimpan riwayat generasi ke database (CRUD).
- **Export System**: Export hasil output ke format `.txt` untuk produksi.
- **Secure Auth**: Sistem login yang aman dengan Clerk.

## 🛠️ Cara Menjalankan Lokal
1. Clone repo ini.
2. Install dependencies: `npm install`.
3. Setup `.env` (DATABASE_URL, GROQ_API_KEY, dll).
4. Sync database: `npx prisma db push`.
5. Run: `npm run dev`.