import { ProjectFolder } from "@/features/projects/components/ProjectFolder"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"

export default function ProjectsPage() {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className="flex-1 space-y-6 lg:space-y-8 p-4 md:p-8 pt-6 min-h-screen flex flex-col">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Mes Projets
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">
                                Gérez vos dossiers, importations et fichiers liés à vos devis.
                            </p>
                        </div>
                    </div>

                    {/* Folders Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8 flex-1 content-start">
                        <ProjectFolder title="Importations" />
                        <ProjectFolder title="Design Web" />
                        <ProjectFolder title="Ressources" />
                    </div>
                </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent className="w-64">
                <ContextMenuItem>Nouveau dossier</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Tout sélectionner</ContextMenuItem>
                <ContextMenuItem>Propriétés</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
