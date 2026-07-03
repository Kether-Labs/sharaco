// app/dashboard/projects/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"

import { Loader2, ArrowLeft, Trash2, Edit3, FileText, TrendingUp, DollarSign, Calendar, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"
import { useDeleteProject, useProject } from "@/features/projects/hooks/useProject"
import { formatCurrency } from "@/features/quotes/lib/formatCurrency"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const { data: project, isLoading } = useProject(projectId)
    console.log(project)
    const deleteMutation = useDeleteProject()

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            await deleteMutation.mutateAsync(projectId)
            router.push("/dashboard/projects")
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Projet introuvable</h2>
                    <Link href="/dashboard/projects">
                        <Button variant="outline">Retour aux projets</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Statut badge config
    const statusConfig: Record<string, { label: string, color: string }> = {
        DRAFT: { label: "Brouillon", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30" },
        ACTIVE: { label: "Actif", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
        COMPLETED: { label: "Terminé", color: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30" },
        ARCHIVED: { label: "Archivé", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30" },
        CANCELLED: { label: "Annulé", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30" },
    }
    const status = statusConfig[project.status] || statusConfig.DRAFT

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {project.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className={`rounded-xl ${status.color}`}>
                                    {status.label}
                                </Badge>
                                <span className="text-sm text-slate-500">
                                    Client: <span className="font-medium text-slate-700 dark:text-slate-300">{project.client_name || "Inconnu"}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Edit3 className="mr-2 h-4 w-4" />
                            Modifier
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">Documents</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {project.documents_count || 0}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">Budget estimé</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {project.budget_cents ? formatCurrency(project.budget_cents) : "—"}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">Facturé</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {project.total_invoiced_cents ? formatCurrency(project.total_invoiced_cents) : "0 €"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                {project.description && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Description</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </div>
                )}

                {/* Attachments Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Paperclip className="h-5 w-5" />
                            Fichiers joints
                        </h2>
                        <Button size="sm" variant="outline">
                            Ajouter un fichier
                        </Button>
                    </div>

                    {project.attachments && project.attachments.length > 0 ? (
                        <div className="space-y-3">
                            {project.attachments.map((att) => (
                                <div key={att.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">{att.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {att.file_type} • {new Date(att.uploaded_at).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={att.file_url} target="_blank" rel="noopener noreferrer">
                                            Voir
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <Paperclip className="h-8 w-8 mx-auto mb-3 opacity-50" />
                            <p>Aucun fichier joint pour le moment</p>
                        </div>
                    )}
                </div>

                {/* Documents liés (Devis/Factures) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Devis & Factures liés
                    </h2>
                    <div className="text-center py-12 text-slate-500">
                        <FileText className="h-8 w-8 mx-auto mb-3 opacity-50" />
                        <p>Les documents liés à ce projet apparaîtront ici.</p>
                        <Button variant="outline" className="mt-4">
                            Créer un devis pour ce projet
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}