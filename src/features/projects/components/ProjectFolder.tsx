"use client"

import { useRouter } from "next/navigation"
import { CloudUpload, FolderOpen, FileText, TrendingUp } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Project } from "../types"


interface ProjectFolderProps {
    project: Project;
    onDelete?: (id: string) => void;
}

export function ProjectFolder({ project, onDelete }: ProjectFolderProps) {
    const router = useRouter();

    const handleOpen = () => {
        router.push(`/dashboard/projects/${project.id}`);
    };

    const handleEdit = () => {
        // TODO: Ouvrir un modal d'édition
        console.log("Éditer le projet:", project.id);
    };

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?\n\nCette action est irréversible.`
        );
        if (confirmed && onDelete) {
            onDelete(project.id);
        }
    };

    // Icône selon le statut
    const getStatusIcon = () => {
        switch (project.status) {
            case 'ACTIVE':
                return <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />;
            case 'COMPLETED':
                return <FileText className="w-8 h-8 text-sky-600 dark:text-sky-400" strokeWidth={1.5} />;
            default:
                return <CloudUpload className="w-8 h-8 text-slate-800 dark:text-slate-200" strokeWidth={1.5} />;
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className="group cursor-pointer flex flex-col w-full"
                    onClick={handleOpen}
                >
                    <div className="relative pt-3 w-full">
                        {/* Back Tab */}
                        <div className="absolute top-0 left-0 w-[45%] h-8 bg-slate-200 dark:bg-slate-800/80 rounded-t-xl transition-colors duration-300 group-hover:bg-slate-300 dark:group-hover:bg-slate-700" />

                        {/* Front Body */}
                        <div className="relative z-10 w-full aspect-[4/3] bg-slate-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-black/5 dark:border-white/5">
                            {getStatusIcon()}
                        </div>
                    </div>

                    <div className="mt-3 ml-1 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm tracking-wide line-clamp-1 block">
                            {project.name}
                        </span>

                        {/* Infos secondaires */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            {project.client_name && (
                                <span className="line-clamp-1">{project.client_name}</span>
                            )}
                            {project.documents_count !== undefined && project.documents_count > 0 && (
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {project.documents_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-64">
                <ContextMenuItem onClick={handleOpen}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Ouvrir le projet
                </ContextMenuItem>
                <ContextMenuItem onClick={handleEdit}>
                    Modifier le projet
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={handleDelete}
                    className="text-red-500 focus:text-red-500 dark:text-red-500 dark:focus:text-red-400"
                >
                    Supprimer le projet
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Propriétés</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}