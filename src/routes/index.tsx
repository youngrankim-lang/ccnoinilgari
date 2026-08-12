import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";

import { BRAND, TIERS, type TierId } from "@/config/brand";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: ApplyPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(80),
  email: z.string().trim().email("올바른 이메일 주소를 입력해 주세요.").max(200),
  tier: z.enum(["general", "regular", "lifetime"]),
});

function ApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<TierId>("general");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, tier });
    if (!parsed.success) {
      const fe: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof errors;
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      tier: parsed.data.tier,
    });
    setSubmitting(false);
    if (error) {
      toast.error("신청 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      console.error(error);
      return;
    }
    toast.success(BRAND.submitSuccess);
    setName("");
    setEmail("");
    setTier("general");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Heart className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">{BRAND.orgName} 후원·회원 신청</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{BRAND.tagline}</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
        >
          <p className="mb-6 text-sm text-muted-foreground">{BRAND.intro}</p>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                이름 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                autoComplete="name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                이메일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block">후원 등급 선택</Label>
              <div role="radiogroup" className="grid gap-3">
                {TIERS.map((t) => {
                  const active = tier === t.id;
                  return (
                    <label
                      key={t.id}
                      className={cn(
                        "cursor-pointer rounded-xl border-2 p-4 text-left transition-all block",
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                          : "border-border bg-background hover:border-primary/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="tier"
                        value={t.id}
                        checked={active}
                        onChange={() => setTier(t.id)}
                        className="sr-only"
                      />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold">{t.label}</span>
                        {active && (
                          <span className="text-xs font-medium text-primary">선택됨</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground/80">{t.hint}</p>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-8 h-12 w-full text-base"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                신청 중…
              </>
            ) : (
              "신청하기"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">{BRAND.footer}</p>
      </div>
    </div>
  );
}
