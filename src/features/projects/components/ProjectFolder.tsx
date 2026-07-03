"use client"

import { CloudUpload } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"

interface ProjectFolderProps {
    title: string;
}

export function ProjectFolder({ title }: ProjectFolderProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className="group cursor-pointer flex flex-col w-full">
                    <div className="relative pt-3 w-full">
                        {/* Back Tab */}
                        <div className="absolute top-0 left-0 w-[45%] h-8 bg-slate-200 dark:bg-slate-800/80 rounded-t-xl transition-colors duration-300 group-hover:bg-slate-300 dark:group-hover:bg-slate-700" />
                        
                        {/* Front Body */}
                        <div className="relative z-10 w-full aspect-[4/3] bg-slate-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-black/5 dark:border-white/5">
                            <CloudUpload className="w-8 h-8 text-slate-800 dark:text-slate-200 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                        </div>
                    </div>
                    
                    <span className="font-bold text-slate-900 dark:text-white text-sm mt-3 ml-1 tracking-wide">
                        {title}
                    </span>
                </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent className="w-64">
                <ContextMenuItem>Ouvrir le dossier</ContextMenuItem>
                <ContextMenuItem>Modifier le dossier</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-red-500 focus:text-red-500 dark:text-red-500 dark:focus:text-red-400">
                    Supprimer le dossier
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Propriétés</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
