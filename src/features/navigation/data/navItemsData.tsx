import { NavItemInterface } from "../types/NavItemsInterface";
import {
  ChevronRight,
  Home,
  Users,
  CreditCard,
  Briefcase,
  Key,
  FileText,
  Trash,
  Folder,
  Settings,
} from "lucide-react";

export const navItems: NavItemInterface[] = [
  { title: "Overview", isHeader: true, icon: null },
  {
    title: "Accueil",
    icon: <Home className="h-4 w-4" />,
    href: ""
  },
  { title: "Business", isHeader: true, icon: null },
  { title: "projects", icon: <Folder className="h-4 w-4" />, href: "/dashboard/projects" },
  { title: "Devis", icon: <FileText className="h-4 w-4" />, href: "/dashboard/quotes" },
  { title: "Clients", icon: <Users className="h-4 w-4" />, href: "/dashboard/clients" },
  { title: "Billing", icon: <CreditCard className="h-4 w-4" />, href: "/dashboard/billing" },
  { title: "System", isHeader: true, icon: null },
  { title: "Paramètres", icon: <Settings className="h-4 w-4" />, href: "/dashboard/settings" },
];