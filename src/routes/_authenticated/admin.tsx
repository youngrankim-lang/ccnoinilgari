import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "ok"; email: string } | { status: "denied"; email: string }
  >({ status: "loading" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email ?? "";
      if (!email) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data, error } = await supabase
        .from("admin_emails")
        .select("email")
        .ilike("email", email)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) setState({ status: "denied", email });
      else setState({ status: "ok", email });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">접근 권한이 없습니다</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            로그인된 계정({state.email})은 관리자 목록에 등록되어 있지 않습니다.
            담당자에게 문의해 주세요.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs text-muted-foreground">{BRAND.orgName} 관리</div>
            <div className="text-sm font-medium">{state.email}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          <NavTab to="/admin">신청 명단</NavTab>
          <NavTab to="/admin/outbox">발송함</NavTab>
          <NavTab to="/admin/templates">메일 템플릿</NavTab>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavTab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
    >
      {children}
    </Link>
  );
}
