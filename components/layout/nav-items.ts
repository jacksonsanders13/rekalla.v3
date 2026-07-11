import {
  House,
  BellRing,
  Sunrise,
  BookOpen,
  HeartPulse,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { AccountType } from "@/types/database";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Patients get the full self-care experience.
const PATIENT_TABS: NavItem[] = [
  { href: "/dashboard", label: "Summary", icon: House },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/routine", label: "Routine", icon: Sunrise },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/wellness", label: "Wellness", icon: HeartPulse },
];

// Caregivers work through the people they care for.
const CAREGIVER_TABS: NavItem[] = [
  { href: "/caregiver", label: "People", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function tabsFor(accountType: AccountType): NavItem[] {
  return accountType === "caregiver" ? CAREGIVER_TABS : PATIENT_TABS;
}
