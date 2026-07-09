import {
  House,
  BellRing,
  Sunrise,
  BookOpen,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** The five bottom tabs. Sharing (caregivers) and Settings live in the header. */
export const TAB_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Summary", icon: House },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/routine", label: "Routine", icon: Sunrise },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/wellness", label: "Wellness", icon: HeartPulse },
];
