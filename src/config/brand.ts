// 단체명·안내 문구는 이 파일에서만 바꾸면 앱 전체에 반영됩니다.
export const BRAND = {
  orgName: "우리 단체",
  tagline: "함께 만드는 변화, 당신의 후원으로 시작됩니다",
  intro:
    "우리 단체의 활동에 마음을 보태주셔서 감사합니다. 아래 양식을 작성해 주시면 담당자가 확인 후 안내 메일을 보내드립니다.",
  submitSuccess: "신청이 접수되었습니다. 감사합니다.",
  contactEmail: "hello@example.org",
  footer: "© 우리 단체 · 이 화면은 강의용 템플릿입니다.",
} as const;

export type TierId = "general" | "regular" | "lifetime";

export const TIERS: {
  id: TierId;
  label: string;
  description: string;
  hint: string;
}[] = [
  {
    id: "general",
    label: "일반 후원",
    description: "1회성으로 자유롭게 후원합니다.",
    hint: "부담 없이 한 번의 마음을 전하고 싶을 때",
  },
  {
    id: "regular",
    label: "정기 후원",
    description: "매달 자동으로 후원합니다.",
    hint: "꾸준한 활동을 지지하고 싶을 때",
  },
  {
    id: "lifetime",
    label: "평생 후원",
    description: "평생 회원으로 함께합니다.",
    hint: "가장 든든한 동반자가 되고 싶을 때",
  },
];

export const TIER_LABEL: Record<TierId, string> = {
  general: "일반",
  regular: "정기",
  lifetime: "평생",
};
