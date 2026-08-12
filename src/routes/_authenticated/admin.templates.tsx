import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/templates")({
  component: TemplatesPage,
});

type Template = { id: string; subject: string; body: string };

function TemplatesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email_template"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("id,subject,body")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Template | null;
    },
  });

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (data) {
      setSubject(data.subject);
      setBody(data.body);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!data) {
        const { error } = await supabase
          .from("email_templates")
          .insert({ subject, body });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("email_templates")
          .update({ subject, body })
          .eq("id", data.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("템플릿을 저장했습니다.");
      qc.invalidateQueries({ queryKey: ["email_template"] });
    },
    onError: (e) => toast.error("저장 실패: " + (e as Error).message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-accent/40 p-4 text-sm">
        <p className="font-medium">사용 가능한 치환 토큰</p>
        <ul className="mt-1 list-disc pl-5 text-muted-foreground">
          <li>
            <code>{"{이름}"}</code> — 신청자 이름
          </li>
          <li>
            <code>{"{등급}"}</code> — 후원 등급(일반/정기/평생)
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject" className="mb-2 block">
              메일 제목
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="body" className="mb-2 block">
              메일 본문
            </Label>
            <Textarea
              id="body"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
