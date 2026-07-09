import { redirect } from "next/navigation";

// Rekalla opens like an app, not a website: straight to the sign-in
// screen. The middleware sends signed-in users to /dashboard instead.
export default function RootPage() {
  redirect("/login");
}
