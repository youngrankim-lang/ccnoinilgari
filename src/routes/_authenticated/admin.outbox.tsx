import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/outbox")({
  component: OutboxPage,
});

type Notification = {
  id: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
};

function OutboxPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id,to_email,subject,body,status,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-accent/40 p-4 text-sm">
        <p className="font-medium">발송함 안내</p>
        <p className="mt-1 text-muted-foreground">
          신청이 접수되면 이메일 초안이 자동 생성되어 이곳에 <code>queued</code> 상태로
          기록됩니다. 실제 이메일 발송은 아직 켜져 있지 않으며, 발송 연동을 추가할 때
          이 목록을 처리하도록 확장할 수 있어요.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          불러오는 중…
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          아직 생성된 안내 메일이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{n.to_email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-secondary px-2 py-0.5">{n.status}</span>
                  <span>{new Date(n.created_at).toLocaleString("ko-KR")}</span>
                </div>
              </div>
              <div className="mt-2 font-medium">{n.subject}</div>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
                {n.body}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
