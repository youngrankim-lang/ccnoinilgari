-- 강원특별자치도 지역별 신청을 위한 컬럼 추가
alter table public.applications
  add column if not exists region text;
