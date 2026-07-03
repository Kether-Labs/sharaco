"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FolderPlus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { clientsApi } from "@/features/clients/api/clientsApi"

import { useRouter } from "next/navigation"
import { useCreateProject } from "../hooks/useProject"

interface CreateProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
    const router = useRouter()
    const createMutation = useCreateProject()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [clientId, setClientId] = useState("")
    const [budget, setBudget] = useState("")

    // Charger les clients pour le select
    const { data: clients = [], isLoading: isLoadingClients } = useQuery({
        queryKey: ['clients'],
        queryFn: () => clientsApi.getAll(),
        enabled: open, // Ne charger que si le modal est ouvert
    })

    // Reset form quand on ferme
    useEffect(() => {
        if (!open) {
            setName("")
            setDescription("")
            setClientId("")
            setBudget("")
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !clientId) return

        try {
            const project = await createMutation.mutateAsync({
                name,
                description: description || undefined,
                client_id: clientId,
                budget_cents: budget ? parseInt(budget) * 100 : undefined, // Convertir en centimes
                status: "DRAFT"
            })

            onOpenChange(false)
            router.push(`/dashboard/projects/${project.id}`)
        } catch (error) {
            console.error("Erreur création:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl border-slate-200/50 dark:border-white/10 shadow-2xl rounded-3xl">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Top Area - Icon & Name */}
                    <div className="pt-10 pb-6 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-sky-500/10 to-transparent">
                        <div className="w-24 h-24 bg-sky-100 dark:bg-sky-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20 dark:ring-white/10 relative group">
                            <FolderPlus className="w-12 h-12 text-sky-600 dark:text-sky-400 transition-transform group-hover:scale-110 duration-300" strokeWidth={1.5} />
                        </div>
                        
                        <input
                            autoFocus
                            placeholder="Nouveau dossier"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Properties Area */}
                    <div className="px-6 pb-6 space-y-4">
                        <div className="p-2 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                            {/* Client Field */}
                            <div className="flex items-center justify-between px-3 py-2 gap-4">
                                <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 w-24 shrink-0">Client</Label>
                                <Select value={clientId} onValueChange={setClientId} required>
                                    <SelectTrigger className="h-8 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 shadow-none focus:ring-0 text-right font-medium">
                                        <SelectValue placeholder="Sélectionner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingClients ? (
                                            <div className="p-2 text-center text-sm text-slate-500">Chargement...</div>
                                        ) : (
                                            clients.map((client: any) => (
                                                <SelectItem key={client.id} value={client.id}>
                                                    {client.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="h-px bg-slate-200/50 dark:bg-white/5 w-full my-1" />
                            
                            {/* Budget Field */}
                            <div className="flex items-center justify-between px-3 py-2 gap-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 w-24 shrink-0">Budget (€)</Label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full text-right bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white"
                                />
                            </div>
                            
                            <div className="h-px bg-slate-200/50 dark:bg-white/5 w-full my-1" />
                            
                            {/* Description Field */}
                            <div className="flex items-start justify-between px-3 py-2 gap-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 w-24 shrink-0 mt-1">Note</Label>
                                <textarea
                                    placeholder="Description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="w-full text-right bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white resize-none"
                                />
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={createMutation.isPending}
                                className="flex-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={!name || !clientId || createMutation.isPending}
                                className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/20"
                            >
                                {createMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Créer"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}