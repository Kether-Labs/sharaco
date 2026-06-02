"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Paintbrush, Save, Minus, Plus, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteDraft } from "../../types/QuoteBuilder";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { FileDown, Send, Copy, ExternalLink, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

interface EditorHeaderProps {
    draft: QuoteDraft;
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onSave?: () => void;
    showActions?: boolean;
    setShowActions?: (show: boolean) => void;
}

export function EditorHeader({ 
    draft, 
    zoom, 
    onZoomIn, 
    onZoomOut, 
    onResetZoom, 
    onSave,
    showActions,
    setShowActions
}: EditorHeaderProps) {
    const [isExporting, setIsExporting] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-[72px] px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 z-[100] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-5 min-w-[300px]">
                <Link href="/dashboard/quotes">
                    <motion.div
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/20 group bg-zinc-900/40 backdrop-blur-md"
                        >
                            <ChevronLeft className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                        </Button>
                    </motion.div>
                </Link>
                
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       
                        <h2 className="text-[10px] font-black text-zinc-500 uppercase">
                            Sharaco Editor
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <p className="text-[15px] font-bold text-zinc-100 tracking-tight leading-none group-hover:text-sky-400 transition-colors">
                            {draft.reference || "Untitled Quote"}
                        </p>
                        <Paintbrush className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>

            {/* Central Zoom Controls - Canva Style */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-inner">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    onClick={onZoomOut}
                >
                    <Minus className="h-3.5 w-3.5" />
                </Button>
                
                <div className="flex items-center justify-center w-14">
                    <span className="text-[11px] font-black text-zinc-100">
                        {Math.round(zoom * 100)}%
                    </span>
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    onClick={onZoomIn}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all group"
                    onClick={onResetZoom}
                    title="Reset Zoom"
                >
                    <Maximize className="h-3.5 w-3.5 transition-colors" />
                </Button>
            </div>

            <div className="flex items-center gap-3 min-w-[300px] justify-end">
                <div className="hidden lg:flex h-8 px-3 rounded-xl bg-zinc-900/50 border border-white/5 items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">Live Sync</span>
                </div>

                <div className="w-px h-6 bg-white/5 mx-1 hidden sm:block" />

                <DropdownMenu open={showActions} onOpenChange={setShowActions}>
                    <DropdownMenuTrigger asChild>
                        <motion.div
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSave?.();
                                }}
                                className="h-10 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_20px_-10px_rgba(14,165,233,0.5)] flex items-center gap-2 active:scale-95 border-t border-white/20"
                            >
                                <Save className="w-3.5 h-3.5" strokeWidth={3} />
                                Enregistrer
                            </Button>
                        </motion.div>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                        align="end" 
                        className="w-80 bg-zinc-900 border-white/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl z-[110]"
                    >
                        <div className="px-3 py-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-none">Devis enregistré</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">{draft.reference}</p>
                                </div>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="bg-white/5 mx-2" />

                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-3 py-2">
                                Actions rapides
                            </DropdownMenuLabel>
                            
                            <DropdownMenuItem 
                                onClick={() => {
                                    setIsExporting(true);
                                    setTimeout(() => setIsExporting(false), 2000);
                                }}
                                className="flex flex-col items-start gap-0.5 p-3 focus:bg-white/5 rounded-xl cursor-pointer group"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-focus:text-sky-400 transition-colors">
                                            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="font-bold text-zinc-200">Télécharger PDF</span>
                                    </div>
                                    <DropdownMenuShortcut className="text-zinc-600 opacity-100 group-focus:text-zinc-400">⌘P</DropdownMenuShortcut>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium pl-8">Générer un document prêt à imprimer</p>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                className="flex flex-col items-start gap-0.5 p-3 focus:bg-white/5 rounded-xl cursor-pointer group"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-focus:text-emerald-400 transition-colors">
                                            <Send className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-bold text-zinc-200">Envoyer au client</span>
                                    </div>
                                    <DropdownMenuShortcut className="text-zinc-600 opacity-100 group-focus:text-zinc-400">⌘E</DropdownMenuShortcut>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium pl-8">Envoi direct par email sécurisé</p>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/5 mx-2" />

                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-3 py-2">
                                Partage
                            </DropdownMenuLabel>
                            
                            <DropdownMenuItem className="flex items-center gap-2 p-3 focus:bg-white/5 rounded-xl cursor-pointer group">
                                <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-focus:text-white transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-zinc-300">Copier le lien public</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="flex items-center gap-2 p-3 focus:bg-white/5 rounded-xl cursor-pointer group">
                                <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-focus:text-white transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-zinc-300">Aperçu en ligne</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/5 mx-2" />

                        <div className="p-1">
                            <DropdownMenuItem className="flex items-center justify-between p-3 focus:bg-sky-500/10 rounded-xl cursor-pointer group">
                                <span className="text-[11px] font-black text-sky-500 uppercase tracking-widest">Tableau de bord</span>
                                <ArrowRight className="w-3.5 h-3.5 text-sky-500 group-hover:translate-x-1 transition-transform" />
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
