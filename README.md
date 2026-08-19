# Remix of AI-챌린지해-입문

한국어로 동작하는 "후원자·회원 신청 서비스"를 Lovable Cloud(백엔드 포함)로 만들어줘. 이 서비스는 강의 수강생들이 remix해서 자기 단체용으로 쓸 템플릿이야. 모바일 우선으로 디자인하고, 한국어 줄바꿈이 자연스럽게 word-break: keep-all을 적용해줘. 단체명·안내문구는 나중에 쉽게 바꿀 수 있게 상수 파일 한 곳(src/config/brand.ts 같은)에 "우리 단체" 같은 placeholder로 모아줘.

[신청 화면 - 공개, 로그인 없음]
- 경로 "/" 에 신청 폼을 만들어줘.
- 입력: 이름(필수), 이메일(필수, 이메일 형식 검증).
- 후원등급 선택: 일반 / 정기 / 평생 세 가지를 카드로 고르게 하고 각 등급 아래 한 줄 설명(placeholder).
- 신청 버튼을 누르면 applications 테이블에 저장하고 "신청이 접수되었습니다" 안내 후 폼을 비워줘.
- 로그인·회원가입·비밀번호는 없어야 해. 신청자는 로그인 없이 신청만 할 수 있어.

[데이터베이스]
- applications 테이블: id(uuid), name(text), email(text), tier(text, general/regular/lifetime), status(text, 기본 received), created_at(timestamptz, 기본 now()).
- admin_emails 테이블: id(uuid), email(text, unique). 관리자 이메일 화이트리스트.
- notifications 테이블: id(uuid), application_id(uuid FK), to_email(text), subject(text), body(text), status(text, 기본 queued), created_at(timestamptz).
- email_templates 테이블(단일 행): id(uuid), subject(text), body(text). body에는 {이름}, {등급} 토큰을 쓸 수 있어. 기본 템플릿을 한국어로 하나 넣어줘.

[담당자 로그인 - 구글]
- Lovable Cloud의 Google 로그인(Managed 모드)을 사용해서 담당자 인증을 붙여줘.
- 경로 "/admin"은 로그인한 사용자 중 admin_emails에 이메일이 있는 사람만 들어갈 수 있어야 해.
- 로그인 안 됨 → 구글 로그인 버튼. 로그인은 됐지만 관리자가 아님 → "접근 권한이 없습니다" 안내.

[관리 화면 /admin - 담당자 전용]
- applications 명단을 표로 보여줘: 번호·이름·이메일·등급·신청일·상태.
- 이름/이메일 검색창, 등급 필터(전체/일반/정기/평생).
- 각 행에서 등급 수정(드롭다운), 삭제(인앱 확인 다이얼로그). JS confirm()은 쓰지 마.
- 상단에 등급별 신청 수와 전체 신청 수 요약 카드.
- 별도 경로 "/admin/outbox"에 자동 생성된 안내 메일 목록(수신자·제목·본문 미리보기·생성시각)을 보여줘.
- 안내 메일 문구(email_templates의 subject/body)를 편집·저장하는 화면도 만들어줘.

[보안 - RLS, 매우 중요]
- applications: INSERT는 로그인 없이 누구나 가능. SELECT/UPDATE/DELETE는 admin_emails에 이메일이 있는 로그인 사용자만 가능.
- notifications, email_templates, admin_emails: 관리자만 읽고 쓸 수 있고 anon은 접근 못 하게 막아줘.
- 프론트에서 숨기는 게 아니라 DB의 Row Level Security 정책으로 막아줘. 로그아웃 상태에서 명단을 직접 조회하면 아무것도 안 나와야 해.

[자동 안내 메일 - 발송함 방식, 무료 플랜에서 동작]
- 신청이 applications에 저장되면 Edge Function이 자동으로 실행되게 해줘.
- 그 함수는 email_templates를 읽어 {이름}, {등급}을 실제 값으로 치환한 제목·본문을 만들고, notifications 테이블에 status='queued'로 저장해줘(실제 이메일 발송은 아직 하지 말고 기록만).
- 이렇게 하면 유료 플랜이나 외부 API 키 없이도 "신청→자동 안내 메일 생성"이 동작해. 이게 의도된 기본 동작이야.
- 발송용 비밀 키는 프론트엔드에 절대 넣지 마. 나중에 진짜 발송을 켤 때만 백엔드 Secret으로 추가할 거야.

[마무리]
- 전체를 한국어 UI로, 모바일에서 잘 보이게 만들어줘.
- 빌드 후 신청→저장→발송함 기록까지 한 번 테스트해서 잘 도는지 확인해줘.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ccnoinilgari.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/178b4a7a-25a5-4e3d-b7ff-741e560b1d0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
