import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Search, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TIER_LABEL, type TierId } from "@/config/brand";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminApplicationsPage,
});

type Application = {
  id: string;
  name: string;
  email: string;
  tier: TierId;
  status: string;
  created_at: string;
};

function AdminApplicationsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [tierFilter, setTierFilter] = useState<TierId | "all">("all");
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,name,email,tier,status,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Application[];
    },
  });

  const updateTier = useMutation({
    mutationFn: async ({ id, tier }: { id: string; tier: TierId }) => {
      const { error } = await supabase.from("applications").update({ tier }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("등급이 수정되었습니다.");
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (e) => toast.error("수정 실패: " + (e as Error).message),
  });

  const deleteRow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (e) => toast.error("삭제 실패: " + (e as Error).message),
  });

  const rows = data ?? [];

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (tierFilter !== "all" && r.tier !== tierFilter) return false;
      if (!kw) return true;
      return r.name.toLowerCase().includes(kw) || r.email.toLowerCase().includes(kw);
    });
  }, [rows, q, tierFilter]);

  const counts = useMemo(() => {
    const c = { total: rows.length, general: 0, regular: 0, lifetime: 0 };
    for (const r of rows) c[r.tier]++;
    return c;
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="전체" value={counts.total} />
        <StatCard label="일반" value={counts.general} />
        <StatCard label="정기" value={counts.regular} />
        <StatCard label="평생" value={counts.lifetime} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="이름 또는 이메일로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as TierId | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="등급" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 등급</SelectItem>
            <SelectItem value="general">일반</SelectItem>
            <SelectItem value="regular">정기</SelectItem>
            <SelectItem value="lifetime">평생</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            불러오는 중…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            표시할 신청 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">번호</th>
                  <th className="px-3 py-2 text-left">이름</th>
                  <th className="px-3 py-2 text-left">이메일</th>
                  <th className="px-3 py-2 text-left">등급</th>
                  <th className="px-3 py-2 text-left">신청일</th>
                  <th className="px-3 py-2 text-left">상태</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.email}</td>
                    <td className="px-3 py-2">
                      <Select
                        value={r.tier}
                        onValueChange={(v) => updateTier.mutate({ id: r.id, tier: v as TierId })}
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">일반</SelectItem>
                          <SelectItem value="regular">정기</SelectItem>
                          <SelectItem value="lifetime">평생</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-3 py-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPendingDelete(r)}
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>신청을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && (
                <>
                  <strong>{pendingDelete.name}</strong>({pendingDelete.email},{" "}
                  {TIER_LABEL[pendingDelete.tier]}) 님의 신청을 삭제합니다. 이 작업은 되돌릴 수 없어요.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteRow.mutate(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
