"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { History, Video, Sparkles, LayoutTemplate, PlayCircle, Download, AlertCircle } from "lucide-react"

export default function DashboardPage() {
    const [videoType, setVideoType] = useState("marketing")
    const [tone, setTone] = useState("casual")
    const [duration, setDuration] = useState("30s")
    const [audience, setAudience] = useState("")
    const [topic, setTopic] = useState("")
    const [keywords, setKeywords] = useState("")

    const [completion, setCompletion] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Ref buat auto-scroll teleprompter
    const scrollRef = useRef<HTMLDivElement>(null)

    // Efek auto-scroll pas teks nambah
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [completion])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setCompletion("")
        setError("")

        const combinedPrompt = `
            Video Type: ${videoType}
            Target Audience: ${audience}
            Tone: ${tone}
            Duration: ${duration}
            Topic: ${topic}
            Keywords: ${keywords}
        `

        try {
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

            // Cek jika server ngirim error (bukan stream)
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Gagal menghubungi AI Server");
            }

            if (!res.body) throw new Error("Tidak ada response dari server");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setCompletion((prev) => prev + chunk);
            }
        } catch (error: any) {
            console.error("Gagal streaming:", error);
            setError(error.message || "Terjadi kesalahan sistem. Coba lagi nanti.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDownload = () => {
        if (!completion) return;
        const safeFileName = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const element = document.createElement("a");
        const file = new Blob([completion], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Script_${safeFileName}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-2 rounded-lg shadow-sm shadow-purple-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            AI Video <span className="text-purple-600">Gen.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors" onClick={() => window.location.href = '/history'}>
                            <History className="w-4 h-4 mr-2" />
                            History
                        </Button>
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <UserButton />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Form Section */}
                    <div className="xl:col-span-5 space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900">Create New Script</h1>
                            <p className="text-sm text-slate-500">Generate storyboard & scene breakdown secara instan.</p>
                        </div>

                        <Card className="shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <form onSubmit={onSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Video Type</Label>
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
                                            <Label className="text-slate-600 font-medium">Visual Tone</Label>
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
                                            <Label className="text-slate-600 font-medium">Duration</Label>
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
                                            <Label className="text-slate-600 font-medium">Target Audience</Label>
                                            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Mahasiswa" className="bg-slate-50 focus:bg-white transition-all" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-slate-600 font-medium">Main Action / Topic</Label>
                                        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Apa topik videonya?" className="bg-slate-50 focus:bg-white transition-all" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-600 font-medium">Keywords (Optional)</Label>
                                        <Textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Contoh: dakwah, modern, tech..." className="resize-none h-20 bg-slate-50 focus:bg-white transition-all" />
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-xl shadow-md shadow-purple-100 transition-all active:scale-[0.98]">
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Generating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <PlayCircle className="w-5 h-5" />
                                                Generate Storyboard
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Output Section */}
                    <div className="xl:col-span-7 flex flex-col">
                        <Card className="flex-grow bg-[#0A0A0A] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 min-h-[600px] rounded-2xl">
                            <CardHeader className="border-b border-slate-800/60 bg-[#111111]/80 backdrop-blur px-6 py-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <LayoutTemplate className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <CardTitle className="text-slate-200 text-sm md:text-base font-semibold">Scene Breakdown & Script</CardTitle>
                                        <CardDescription className="text-slate-500 text-[10px] md:text-xs mt-0.5 tracking-wide">LLAMA 3.1 REAL-TIME ENGINE</CardDescription>
                                    </div>
                                </div>
                                {completion && !isLoading && (
                                    <Button onClick={handleDownload} size="sm" variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                                        <Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                )}
                            </CardHeader>

                            <CardContent
                                ref={scrollRef}
                                className="flex-grow p-6 relative overflow-y-auto max-h-[550px] scroll-smooth"
                            >
                                {error && (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="bg-red-500/10 p-4 rounded-full">
                                            <AlertCircle className="w-10 h-10 text-red-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-red-400 font-semibold">Generation Failed</h3>
                                            <p className="text-slate-500 text-sm max-w-xs">{error}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-slate-800 text-slate-400">Try Again</Button>
                                    </div>
                                )}

                                {!isLoading && !completion && !error ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-800/30 flex items-center justify-center mb-4 ring-1 ring-slate-700/50 rotate-3 group-hover:rotate-0 transition-transform">
                                            <Video className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 font-medium">Ready to Visualize</p>
                                        <p className="text-slate-600 text-xs mt-1 max-w-[250px] leading-relaxed">Input ide lu dan biarkan AI menyusun struktur video profesional.</p>
                                    </div>
                                ) : (
                                    <div className="text-slate-200 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                                        {completion}
                                        {isLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-purple-500 animate-pulse"></span>}
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