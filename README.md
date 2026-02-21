# Operation: White Shield

> 화이트 해커가 되어 사이버 공격을 방어하라! CLI 기반 보안 시뮬레이션 텍스트 어드벤처 게임

<p align="center">
  <img src="asset/icon.jpg" alt="White Shield Icon" width="200">
</p>

<p align="center">
  <a href="https://white-shield.vercel.app">Play Now</a>
</p>

---

## 게임 소개

**Operation: White Shield**는 브라우저에서 플레이하는 CLI(명령줄) 텍스트 어드벤처 게임입니다. 플레이어는 화이트 해커 요원이 되어 G-DECK(휴대용 보안 단말기)을 통해 해킹 공격을 분석하고 방어합니다.

실제 리눅스 보안 명령어를 입력하며 진행하는 게임으로, 사이버 보안의 기초 개념을 자연스럽게 체험할 수 있습니다.

### 스토리

본부 서버가 정체불명의 해커 그룹 **Blackwing APT**의 공격을 받고 있다. 단장의 지휘 아래, AI 지원 시스템 **O.R.O.R.A**의 도움을 받아 침입 흔적을 추적하고 시스템을 방어하라.

- **ACT 1 — Operation: White Shield**: IT 서버 방어 (19개 임무)
- **ACT 2 — Operation: Ironclad**: SCADA/OT 산업제어시스템 방어 (6개 임무)

---

## 주요 기능

### 게임플레이
- **25개 본편 임무** + **5개 VR 훈련 튜토리얼**
- **5단계 명령어 매칭**: 정확 → 패턴(정규식) → 키워드 → 부분일치 → 미일치
- **관대한 파서**: 튜토리얼에서 `df` 입력 시 `df -h`로 인정하며 코칭 피드백 제공
- **넛지 힌트**: 완전히 막혔을 때 첫 글자 힌트 제공
- **3단계 힌트 시스템**: `hint` 명령어로 점진적 힌트 열람
- **자동 힌트**: 연속 오답 시 자동으로 힌트 제공 (튜토리얼 2회, 본편 3회)
- **위험 명령어 경고**: `rm -rf /`, `:(){ :|:& };:` 등 위험 명령 입력 시 교육적 경고
- **오타 교정**: Levenshtein 거리 기반 "혹시 이 명령어?" 제안
- **Windows 명령어 안내**: `ipconfig` → `ifconfig` 등 리눅스 대응 명령어 안내

### 시스템
- **G-DECK HUD**: 스텔스 게이지, O.R.O.R.A 상태, TITAN 위협 레벨, 온도, 미션 카운터
- **자동 저장**: 스테이지 완료 시 자동 저장, 새로고침 후 이어하기 가능
- **엔딩 인증서**: 클리어 시 인증서 오버레이 (텍스트 복사 / PNG 이미지 저장)
- **BGM 시스템**: 메인 BGM + 엔딩 BGM 크로스페이드 전환
- **CRT 이펙트**: 스캔라인, 비네팅, 타이핑 커서 애니메이션
- **접근성**: `prefers-reduced-motion` 지원, WCAG 대비 준수

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Vanilla HTML / CSS / JavaScript (ES5 호환) |
| 빌드 도구 | 없음 (Zero build, `file://` 로컬 실행 가능) |
| 배포 | Vercel (정적 호스팅) |
| 이미지 생성 | html2canvas (CDN, 지연 로딩) |
| 저장 | localStorage |

### 아키텍처

빌드 도구 없이 `<script>` 태그 순서로 의존성을 관리하는 순수 바닐라 JS 구조입니다. 전역 네임스페이스 `window.WS`를 사용합니다.

```
┌─ data/strings.js ─── 공통 UI 문자열
├─ data/stages.js ──── 39개 스테이지 데이터 (briefing, commands, hints...)
├─ js/audio.js ──────── 효과음 (WebAudio API)
├─ js/parser.js ─────── 5단계 명령어 매칭 엔진 + 오타/위험/Windows 체크
├─ js/hint-system.js ── 힌트 상태 추적
├─ js/terminal.js ───── 터미널 렌더링 (타이핑 애니메이션, 입력, 스크롤)
├─ js/hud.js ────────── G-DECK HUD 오버레이
├─ js/save-manager.js ─ localStorage 자동 저장/로드
├─ js/certificate.js ── 엔딩 인증서 (복사/PNG 저장)
├─ js/stage-manager.js  중앙 게임 컨트롤러 (상태 머신)
├─ js/bgm.js ────────── BGM 재생/볼륨/트랙 전환
└─ js/main.js ───────── 부팅 시퀀스 + 세이브 감지 + 닉네임 프롬프트
```

**상태 머신 플로우:**

```
BRIEFING → OBJECTIVE → AWAITING_INPUT → RESULT → TRANSITION → (다음 스테이지)
```

**입력 처리 플로우:**

```
입력 → meta 명령 (help/hint/clear/status)
     → 빈 입력 스킵
     → matchCommand (정확/패턴/키워드 매칭) → 성공 시 return
     → lenient 체크 (튜토리얼 관대 매칭) → 성공 시 코칭 + return
     → 위험 명령어 경고
     → Windows 명령어 안내
     → 오타 제안
     → 오답 피드백 (PARTIAL / nudge / generic)
     → 자동 힌트 (임계값 초과 시)
```

---

## 프로젝트 구조

```
White Shield/
├── index.html              # 메인 HTML (HUD, 터미널, 인증서 오버레이)
├── css/
│   ├── terminal.css        # 터미널 UI, 색상 클래스, 반응형
│   └── effects.css         # CRT, 애니메이션, HUD, 인증서 스타일
├── data/
│   ├── strings.js          # 공통 UI 문자열 (피드백, 도움말 등)
│   └── stages.js           # 39개 스테이지 정의 (~2800줄)
├── js/
│   ├── audio.js            # WebAudio 효과음
│   ├── parser.js           # 명령어 매칭 엔진
│   ├── hint-system.js      # 힌트 상태 관리
│   ├── terminal.js         # 터미널 렌더링 엔진
│   ├── hud.js              # G-DECK HUD
│   ├── save-manager.js     # 자동 저장/로드
│   ├── certificate.js      # 엔딩 인증서
│   ├── stage-manager.js    # 게임 상태 머신
│   ├── bgm.js              # BGM 컨트롤러
│   └── main.js             # 부팅 시퀀스
├── bgm/
│   ├── White Shield.mp3    # 메인 BGM
│   └── White Shield ENDING.mp3  # 엔딩 BGM
└── asset/
    └── icon.jpg            # 앱 아이콘 (OG 이미지)
```

---

## 기획

### 세계관 설정

| 요소 | 설명 |
|------|------|
| **G-DECK** | 플레이어의 휴대용 보안 단말기. 모든 명령어를 여기서 실행 |
| **O.R.O.R.A** | 본부 AI 지원 시스템. 힌트 제공, 위험 감지, 상황 분석 |
| **단장** | 작전 지휘관. 임무 브리핑, 격려, 피드백 담당 |
| **Blackwing** | 적대 APT 해커 그룹. IT 서버 침투 → OT 시스템 공격 |
| **TITAN** | Blackwing의 메인프레임. ACT 2의 핵심 위협 |

### 스테이지 구성

| 구간 | 스테이지 | 임무 수 | 내용 |
|------|----------|---------|------|
| VR Training | stage_t0~t5 | 5 | 기초 명령어 훈련 (pwd, df, ps, kill, netstat) |
| ACT 1 전반 | stage_1~8 | 8 | 침입 분석, 네트워크 정찰, IP 차단, 악성코드 제거 |
| 데이터 유출 | stage_db1~5 | 5 | RAT 탐지, 정보 유출 파악, DB 암호화, 데이터 삭제 |
| ACT 1 후반 | stage_9~14 | 6 | SSH 강화, 포렌식, 역추적, 패스워드 보안, 취약점 스캔 |
| ACT 2 | stage_15~20 | 6 | SCADA 방어: Modbus, HMI, 펌웨어, OT 격리, DDoS |
| 엔딩 | stage_ending | — | 작전 보고서, Blackwing 최종 메시지, 인증서 |

### 난이도 설계

- **튜토리얼**: 관대한 파서 (부분 명령 인정) + 넛지 힌트 + 자동 힌트 2회 임계
- **본편 전반**: 키워드 매칭 허용 + 자동 힌트 3회 임계
- **본편 후반**: 정확한 옵션 필요 + 전문가용 대안 명령어 인정
- **ACT 2**: 산업제어 전문 명령어 + SCADA 용어 점진적 학습

### 교육 목표

게임을 통해 자연스럽게 학습하는 보안 개념:

1. **로그 분석**: `cat /var/log/auth.log`, `lastb`, `history`
2. **네트워크 보안**: `netstat`, `iptables`, `nmap`, `tcpdump`
3. **프로세스 관리**: `ps -ef`, `kill -9`, `lsof`
4. **파일 시스템 보안**: `find`, `rm`, `chattr`, `shred`
5. **인증 보안**: `passwd`, `chage`, `ssh-keygen`
6. **암호화**: `openssl enc`, 해시 검증
7. **산업제어(OT) 보안**: Modbus, HMI, PLC, SCADA 개념

---

## QA 테스트

### 테스트 방법론

3년 경력 게임 테스터 관점에서 텍스트 전용 게임 특화 QA를 수행했습니다.

#### 테스트 영역

| 영역 | 테스트 항목 | 도구 |
|------|------------|------|
| UI/UX | 모바일 입력, 스크롤, 포커스, 색상 대비 | Chrome DevTools, WCAG 검증 |
| 게임플레이 | 스테이지 진행, 힌트 시스템, 파서 정확도 | 수동 플레이스루 |
| 파서 엣지케이스 | 오타, 대소문자, 여백, 위험 명령어 | 경계값 입력 테스트 |
| 성능 | 타이핑 애니메이션, 스크롤, 메모리 | Performance 탭 프로파일링 |
| 접근성 | 키보드 내비게이션, 화면 낭독기, reduced-motion | 접근성 감사 |

#### 발견 및 수정된 이슈 (16건)

**Critical (2건)**
- 모바일 입력 포커스 유실 → 포커스 인디케이터 + sticky 입력 바
- 입력 커서 미표시 → 네이티브 캐럿 복원 + [Enter] 힌트

**High (6건)**
- 튜토리얼 용어 과부하 → 용어 설명을 인터스티셜(성공 후)로 이동
- ACT 2 인트로 60줄 텍스트벽 → SCADA 용어 4개를 임무 3개에 분산
- 스토리 연결 부재 → stage_8→데이터유출, IT→SCADA 피봇 브릿지 추가
- 색상 대비 미달 → `.dim` 색상 #555 → #888 (WCAG AA 준수)
- HUD 카운터 혼동 → 튜토리얼(T1/5)/본편(1/25) 분리
- 힌트 임계값 과도 → 튜토리얼 2회, 본편 3회로 차등 적용

**Medium (8건)**
- reduced-motion 미지원 → CSS 미디어 쿼리 추가
- 타이핑 애니메이션 끊김 → rAF 스크롤 스로틀링
- Firefox 스크롤바 → `scrollbar-width: thin` 추가
- HUD 텍스트 가독성 → 투명도 0.6 → 0.85
- 기타 마이너 UX 개선

---

## 로컬 실행

빌드 도구가 필요 없습니다. 파일을 그대로 브라우저에서 열 수 있습니다.

```bash
# 방법 1: 파일 직접 열기
open index.html        # macOS
start index.html       # Windows

# 방법 2: 로컬 서버 (BGM 재생을 위해 권장)
npx serve .
# 또는
python -m http.server 8000
```

---

## 플레이 가이드

### 기본 조작
- 리눅스 명령어를 입력하고 `Enter`를 누르세요
- `help` — 도움말 표시
- `hint` — 현재 단계 힌트 보기
- `clear` — 화면 초기화
- `status` — 진행 상황 확인

### 팁
- 모르는 명령어가 나와도 괜찮습니다 — 힌트 시스템이 점진적으로 안내합니다
- 오타가 나면 자동으로 "혹시 이 명령어?" 제안이 뜹니다
- 진행 상황은 자동 저장되니 언제든 브라우저를 닫아도 됩니다
- 엔딩에서 인증서를 저장하고 공유하세요!

---

## 라이선스

This project is for educational purposes.

---

<p align="center">
  Made with Claude Code
</p>
