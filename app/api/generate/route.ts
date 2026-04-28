import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const { prompt, type, topic, duration } = body;

        // Perintah AI dipertajam untuk ngeluarin Scene Breakdown (Bonus Poin Magang)
        const systemPrompt = `Sebagai Video Director, buatkan Scene-by-Scene Breakdown dan Script lengkap berdasarkan ide ini:\n\n${prompt}\n\nFormat output harus profesional, bagi menjadi: [SCENE 1], [VISUAL], [AUDIO/VOICEOVER], dst. Sesuaikan dengan durasi ${duration}.`;

        const result = await streamText({
            model: groq('llama-3.1-8b-instant'),
            prompt: systemPrompt,
            onFinish: async ({ text }) => {
                if (userId) {
                    try {
                        await prisma.videoScript.create({
                            data: {
                                userId: userId,
                                topic: topic || "Untitled",
                                type: type || "General",
                                duration: duration || "15s",
                                content: text,
                                // videoUrl dibiarkan kosong karena kita pakai teks
                            },
                        });
                        console.log("✅ Script Scene Breakdown berhasil disimpan ke DB!");
                    } catch (dbError) {
                        console.error("❌ Gagal nyimpen ke DB:", dbError);
                    }
                }
            },
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error("❌ Terjadi Error di API Groq:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}