// 강원특별자치도 18개 시·군
export type GangwonRegionId =
  | "chuncheon"
  | "wonju"
  | "gangneung"
  | "donghae"
  | "taebaek"
  | "sokcho"
  | "samcheok"
  | "hongcheon"
  | "hoengseong"
  | "yeongwol"
  | "pyeongchang"
  | "jeongseon"
  | "cheorwon"
  | "hwacheon"
  | "yanggu"
  | "inje"
  | "goseong"
  | "yangyang";

export const GANGWON_REGIONS: { id: GangwonRegionId; label: string }[] = [
  { id: "chuncheon", label: "춘천시" },
  { id: "wonju", label: "원주시" },
  { id: "gangneung", label: "강릉시" },
  { id: "donghae", label: "동해시" },
  { id: "taebaek", label: "태백시" },
  { id: "sokcho", label: "속초시" },
  { id: "samcheok", label: "삼척시" },
  { id: "hongcheon", label: "홍천군" },
  { id: "hoengseong", label: "횡성군" },
  { id: "yeongwol", label: "영월군" },
  { id: "pyeongchang", label: "평창군" },
  { id: "jeongseon", label: "정선군" },
  { id: "cheorwon", label: "철원군" },
  { id: "hwacheon", label: "화천군" },
  { id: "yanggu", label: "양구군" },
  { id: "inje", label: "인제군" },
  { id: "goseong", label: "고성군" },
  { id: "yangyang", label: "양양군" },
];

export const GANGWON_REGION_LABEL: Record<GangwonRegionId, string> = GANGWON_REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r.label;
    return acc;
  },
  {} as Record<GangwonRegionId, string>,
);
