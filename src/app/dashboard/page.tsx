import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <h1 className="text-3xl font-bold text-white">
        Welcome to the Vanakam DSA Dashboard
      </h1>
    </div>
  );
}
