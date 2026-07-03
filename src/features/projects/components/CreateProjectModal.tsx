// features/projects/components/CreateProjectModal.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Nouveau Projet
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Créez un nouveau projet pour organiser vos devis et factures.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Nom du projet */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du projet *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Refonte site web e-commerce"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-slate-50 dark:bg-slate-900"
                        />
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                        <Label>Client associé *</Label>
                        <Select value={clientId} onValueChange={setClientId} required>
                            <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                                <SelectValue placeholder="Sélectionner un client" />
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

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Détails du projet, objectifs, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="bg-slate-50 dark:bg-slate-900 resize-none"
                        />
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget estimé (€)</Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="0"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900"
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={createMutation.isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name || !clientId || createMutation.isPending}
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Création...
                            </>
                        ) : (
                            <>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                Créer le projet
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}