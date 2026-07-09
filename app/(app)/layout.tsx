import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppProviders } from "./providers";
import { AppHeader } from "@/components/layout/app-header";
import { TabBar } from "@/components/layout/tab-bar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppProviders>
      <div className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-elev-2 focus:px-4 focus:py-2 focus:text-label"
        >
          Skip to main content
        </a>
        <AppHeader />
        <main id="main" className="mx-auto w-full max-w-xl px-4 pb-32 pt-6">
          {children}
        </main>
        <TabBar />
      </div>
    </AppProviders>
  );
}
