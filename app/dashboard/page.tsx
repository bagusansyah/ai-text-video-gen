"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { History, Video, Sparkles, LayoutTemplate, PlayCircle, Download } from "lucide-react"

export default function DashboardPage() {
    const [videoType, setVideoType] = useState("marketing")
    const [tone, setTone] = useState("casual")
    const [duration, setDuration] = useState("30s")
    const [audience, setAudience] = useState("")
    const [topic, setTopic] = useState("")
    const [keywords, setKeywords] = useState("")

    // Kita pake manual state, BUANG useCompletion yang nge-bug itu!
    const [completion, setCompletion] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setCompletion("") // Reset layar

        const combinedPrompt = `
            Video Type: ${videoType}
            Target Audience: ${audience}
            Tone: ${tone}
            Duration: ${duration}
            Topic: ${topic}
            Keywords: ${keywords}
        `

        try {
            // Tembak API secara native
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: combinedPrompt,
                    topic: topic,
                    type: videoType,
                    duration: duration
                })
            });

            if (!res.body) throw new Error("Tidak ada response dari server");

            // Jurus Native Stream Reader (Membaca teks per karakter secara live)
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Terjemahkan data dan tampilkan ke layar pelan-pelan
                const chunk = decoder.decode(value, { stream: true });
                setCompletion((prev) => prev + chunk);
            }
        } catch (error) {
            console.error("Gagal streaming:", error);
            setCompletion("Terjadi kesalahan saat memuat script. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDownload = () => {
        if (!completion) return;
        const element = document.createElement("a");
        const file = new Blob([completion], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Scene_Breakdown_${topic.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            {/* Navbar / Top Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-2 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            AI Video <span className="text-purple-600">Gen.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors" onClick={() => window.location.href = '/history'}>
                            <History className="w-4 h-4 mr-2" />
                            History Generation
                        </Button>
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Kolom Kiri: Form Input */}
                    <div className="xl:col-span-5 space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900">Create New Video</h1>
                            <p className="text-sm text-slate-500">Tentukan parameter AI untuk hasil script yang maksimal.</p>
                        </div>

                        <Card className="shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <form onSubmit={onSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Video Type</Label>
                                            <Select value={videoType} onValueChange={setVideoType}>
                                                <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="marketing">Marketing</SelectItem>
                                                    <SelectItem value="educational">Educational</SelectItem>
                                                    <SelectItem value="reels">Tiktok / Reels</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Visual Tone</Label>
                                            <Select value={tone} onValueChange={setTone}>
                                                <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Pilih Tone" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="casual">Bright & Casual</SelectItem>
                                                    <SelectItem value="formal">Corporate & Clean</SelectItem>
                                                    <SelectItem value="persuasive">Persuasive (Sales)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Duration</Label>
                                            <Select value={duration} onValueChange={setDuration}>
                                                <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Durasi" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="15s">15 Seconds</SelectItem>
                                                    <SelectItem value="30s">30 Seconds</SelectItem>
                                                    <SelectItem value="60s">60 Seconds</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Target Audience</Label>
                                            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Mahasiswa" className="bg-slate-50" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-slate-600">Main Action / Topic</Label>
                                        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Apa topik videonya?" className="bg-slate-50" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-600">Keywords (Optional)</Label>
                                        <Textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Contoh: dakwah, modern, tech..." className="resize-none h-20 bg-slate-50" />
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 rounded-xl shadow-md transition-all active:scale-[0.98]">
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Generating Scene...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <PlayCircle className="w-5 h-5" />
                                                Generate Breakdown
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Hasil Output AI (Teleprompter UI) */}
                    <div className="xl:col-span-7 flex flex-col">
                        <Card className="flex-grow bg-[#0A0A0A] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 min-h-[600px]">
                            <CardHeader className="border-b border-slate-800/60 bg-[#111111] px-6 py-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <LayoutTemplate className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <CardTitle className="text-slate-200 text-base">Scene Breakdown & Script</CardTitle>
                                        <CardDescription className="text-slate-500 text-xs mt-0.5">Powered by Llama 3.1 Engine</CardDescription>
                                    </div>
                                </div>
                                {/* Tombol Download .txt */}
                                {completion && (
                                    <Button onClick={handleDownload} size="sm" variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                        <Download className="w-4 h-4 mr-2" /> Export .txt
                                    </Button>
                                )}
                            </CardHeader>

                            <CardContent className="flex-grow p-0 relative overflow-y-auto max-h-[600px] custom-scrollbar">
                                {!isLoading && !completion ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center h-full">
                                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 ring-1 ring-slate-700/50">
                                            <Video className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <p className="text-slate-400 font-medium">Ready to Generate</p>
                                        <p className="text-slate-600 text-sm mt-1 max-w-[250px]">Isi form dan dapatkan scene-by-scene script breakdown.</p>
                                    </div>
                                ) : (
                                    <div className="p-6 text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                        {completion}
                                        {isLoading && <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse"></span>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    )
}