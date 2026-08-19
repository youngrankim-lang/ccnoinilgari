import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Smartphone, Users, Heart, Building2, Sparkles } from "lucide-react";

import { BRAND } from "@/config/brand";

export const Route = createFileRoute("/trends")({
  component: TrendsPage,
});

const SECTIONS = [
  {
    icon: Smartphone,
    title: "모바일 소액 기부가 일상이 되다",
    body: "카카오같이가치 등 모바일 플랫폼을 통한 소액 기부 참여가 특별한 이벤트가 아니라 많은 사람들의 일상적인 참여 방식으로 자리 잡았습니다. 2026년 7월 기준 누적 모금액이 1,053억 원을 넘어설 정도로 '가볍게, 자주' 참여하는 기부 문화가 확산되고 있습니다.",
  },
  {
    icon: Users,
    title: "정기후원과 자동이체 방식 선호",
    body: "기부자들이 가장 참여하기 편하다고 답한 방식은 구매금액 일부 자동 전환, 자동이체를 통한 정기기부, 마일리지·포인트 기부입니다. 1회성보다 '꾸준히, 부담 없이' 이어갈 수 있는 정기후원 구조를 만드는 것이 참여를 늘리는 핵심입니다.",
  },
  {
    icon: Sparkles,
    title: "관계와 참여로 확장되는 기부",
    body: "기빙서클, 팬덤 기부, 플랫폼 기부, 고향사랑기부제 등 '누구에게 어떻게 기부하는가'보다 '누구와 함께, 어떤 관계 속에서 참여하는가'가 중요해지고 있습니다. 후원자를 단순 후원금 납부자가 아니라 활동에 함께하는 참여자로 대하는 소통이 중요해졌습니다.",
  },
  {
    icon: Heart,
    title: "세대별 참여 특성",
    body: "연령별 기부 참여율은 40·50대가 각각 33%로 가장 높고, 30대 25%, 20대 20% 순입니다. 다만 MZ세대는 SNS·모바일 기반의 참여형 기부(포인트 적립, 챌린지 기부 등)를 선호해, 세대에 맞는 참여 채널을 함께 마련하는 것이 효과적입니다.",
  },
  {
    icon: Building2,
    title: "기업·지역사회와의 협력 강화",
    body: "정부 예산의 한계로 민간 자원과의 협력이 강조되면서, 기업의 사회공헌(CSR) 활동이 지역 복지기관과 연계되는 사례가 늘고 있습니다. 지역 내 기업·단체와의 파트너십을 통한 후원 확대 여지가 커지고 있습니다.",
  },
];

function TrendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          신청 화면으로 돌아가기
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">요즘 후원 트렌드</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {BRAND.orgName}이(가) 참고한 최신 기부·후원 동향을 소개합니다.
          </p>
        </header>

        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-semibold">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="mb-1 font-medium text-foreground/80">참고 자료</p>
          <ul className="space-y-1">
            <li>
              <a
                href="https://csrhub.chest.or.kr/insight/publications/47"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                사회복지공동모금회 사랑의열매, 「기부트렌드 2026」
              </a>
            </li>
            <li>
              <a
                href="https://research.beautifulfund.org/24376/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                아름다운재단 기부문화연구소, 「2026 필란트로피 트렌드」
              </a>
            </li>
            <li>
              <a
                href="https://www.trendmonitor.co.kr/Data/CKOREA/3315/20251231013121_20251208%202025%20%EA%B8%B0%EB%B6%80%20%EA%B2%BD%ED%97%98%20%EB%B0%8F%20%EA%B8%B0%EB%B6%80%20%EB%AC%B8%ED%99%94%20%EA%B4%80%EB%A0%A8%20%EC%9D%B8%EC%8B%9D%20%EC%A1%B0%EC%82%AC_%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.pdf"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                트렌드모니터, 「2025 기부경험 및 기부문화 관련 인식조사」
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
