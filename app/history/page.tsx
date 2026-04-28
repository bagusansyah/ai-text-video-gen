import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function HistoryPage() {
    const { userId } = await auth();

    // Ambil data dari tabel yang dibikinin AI Agent semalam
    // Sesuaikan nama tabelnya (misal: videoScript atau history)
    const history = await prisma.videoScript.findMany({
        where: { userId: userId as string },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Generation History</h1>
            {history.length === 0 ? (
                <p className="text-slate-500">Belum ada script yang dibuat.</p>
            ) : (
                history.map((item: any) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <CardTitle>{item.topic}</CardTitle>
                            <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
                                {item.content.substring(0, 300)}...
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}