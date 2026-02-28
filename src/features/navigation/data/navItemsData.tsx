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
} from "lucide-react";

export const navItems: NavItemInterface[] = [
  { title: "Overview", isHeader: true, icon: null },
  {
    title: "Dashboards",
    icon: <Home className="h-4 w-4" />,
    submenu: [
      { title: "Analytics", icon: <ChevronRight className="h-4 w-4" />, href: "/dashboard" },
      { title: "CRM", icon: <ChevronRight className="h-4 w-4" />, href: "/dashboard/crm" },
      { title: "eCommerce", icon: <ChevronRight className="h-4 w-4" />, href: "/dashboard/ecommerce" },
    ],
  },
  { title: "Business", isHeader: true, icon: null },
  { title: "Quotes", icon: <FileText className="h-4 w-4" />, href: "/dashboard/quotes" },
  { title: "Clients", icon: <Users className="h-4 w-4" />, href: "/dashboard/clients" },
  { title: "Billing", icon: <CreditCard className="h-4 w-4" />, href: "/dashboard/billing" },
  { title: "System", isHeader: true, icon: null },
  { title: "Paramètres", icon: <Key className="h-4 w-4" />, href: "/dashboard/settings" },
];