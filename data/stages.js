/**
 * Stage definitions for Operation: White Shield
 * 10 missions using real cybersecurity CLI commands.
 * Attacker IP: 45.33.32.156 | Hacker group: Gashiga
 */
var WS = window.WS || {};

WS.stages = [

  /* ══════════════════════════════════════════
   * MISSION 1: 로그 포렌식 - 침입 흔적 분석
   * ══════════════════════════════════════════ */
  {
    id: 'stage_1',
    title: '임무 1: 침입 흔적 분석',
    briefing: [
      { text: '', 'class': '' },
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '[통신 수신 중...]', 'class': 'system', delay: 600 },
      { text: '', 'class': '' },
      { text: '[단장] {name}, 본부 서버에 비정상적인 접근 시도가 감지됐다.', 'class': 'commander', delay: 300 },
      { text: '[단장] 인증 로그에 뭔가 잔뜩 쌓여있어. 실패한 로그인만 필터링해서 봐.', 'class': 'commander', delay: 300 },
      { text: '[단장] grep 명령어로 "Failed password" 기록만 추출해라.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ────────────────────────────────────┐', 'class': 'objective' },
      { text: '│ 인증 로그에서 실패한 로그인 기록을 필터링하라      │', 'class': 'objective' },
      { text: '│ 파일: /var/log/auth.log                         │', 'class': 'objective' },
      { text: '└────────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'grep_auth',
        exact: 'grep "Failed password" /var/log/auth.log',
        alts: [
          'grep "Failed password" /var/log/auth.log',
          "grep 'Failed password' /var/log/auth.log",
          'grep Failed password /var/log/auth.log',
          'grep "failed password" /var/log/auth.log',
          'sudo grep "Failed password" /var/log/auth.log',
          'cat /var/log/auth.log | grep "Failed password"',
          'cat /var/log/auth.log | grep Failed',
          'grep -i "failed password" /var/log/auth.log',
        ],
        keywords: ['grep', 'auth.log'],
        pattern: 'grep.*[Ff]ailed.*auth\\.log|cat.*auth\\.log.*grep.*[Ff]ailed',
        wrongFeedback: {
          partial: '로그 파일에서 특정 문자열을 검색하려면 grep을 사용해봐.',
        },
      },
    ],
    interstitial: {
      grep_auth: [
        { text: '', 'class': '' },
        { text: '[시스템] 필터링 결과 출력 중...', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'Feb 21 03:14:07 sshd[8341]: Failed password for root from 45.33.32.156 port 44231', 'class': 'dim', speed: 8 },
        { text: 'Feb 21 03:14:08 sshd[8342]: Failed password for root from 45.33.32.156 port 44232', 'class': 'dim', speed: 8 },
        { text: 'Feb 21 03:14:08 sshd[8343]: Failed password for admin from 45.33.32.156 port 44233', 'class': 'dim', speed: 8 },
        { text: 'Feb 21 03:14:09 sshd[8344]: Failed password for admin from 45.33.32.156 port 44234', 'class': 'dim', speed: 8 },
        { text: '... (총 3,841건의 Failed password 기록)', 'class': 'system', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 브루트포스 공격 감지!', 'class': 'error', delay: 400 },
        { text: '[경고] 공격 출발지: 45.33.32.156 → root, admin 계정 대상', 'class': 'error', delay: 200 },
        { text: '[경고] 03:22:51 root 계정 로그인 성공 확인!', 'class': 'error', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 좋아, {name}. 상황이 명확해졌다.', 'class': 'commander', delay: 300 },
      { text: '[단장] 45.33.32.156에서 브루트포스로 root를 뚫었군.', 'class': 'commander', delay: 300 },
      { text: '[단장] 놈이 뭘 하고 있는지 네트워크부터 확인하자.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 1 완료: 침입 흔적 분석 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      'grep 명령어로 특정 텍스트를 검색할 수 있습니다.',
      'grep "검색어" 파일경로 형식입니다.',
      '정답: grep "Failed password" /var/log/auth.log',
    ],
    next: 'stage_2',
  },

  /* ══════════════════════════════════════════
   * MISSION 2: 네트워크 정찰
   * ══════════════════════════════════════════ */
  {
    id: 'stage_2',
    title: '임무 2: 네트워크 정찰',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 지금 열려있는 포트를 확인해봐, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 놈이 어떤 백도어를 열어놨는지 네트워크 상태를 스캔해라.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ─────────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 열린 포트와 리스닝 프로세스를 확인하라    │', 'class': 'objective' },
      { text: '│ 2단계: 의심 포트를 사용하는 프로세스를 추적하라   │', 'class': 'objective' },
      { text: '└──────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'netstat',
        exact: 'netstat -tulnp',
        alts: [
          'netstat -tulnp', 'sudo netstat -tulnp',
          'netstat -tlnp', 'netstat -tunlp',
          'ss -tulnp', 'ss -tulwn', 'sudo ss -tulnp',
        ],
        keywords: ['netstat'],
        pattern: '(sudo\\s+)?(netstat|ss)\\s+(-[tulnpw]+)',
        wrongFeedback: {
          partial: '네트워크 상태를 확인하는 명령어를 써봐. netstat이나 ss를 사용해.',
        },
      },
      {
        id: 'lsof_port',
        exact: 'lsof -i :4444',
        alts: [
          'lsof -i :4444', 'sudo lsof -i :4444',
          'lsof -i:4444', 'sudo lsof -i:4444',
          'fuser 4444/tcp',
        ],
        keywords: ['lsof', '4444'],
        pattern: '(sudo\\s+)?(lsof\\s+-i\\s*:?\\s*4444|fuser\\s+4444)',
        wrongFeedback: {
          partial: '특정 포트를 사용하는 프로세스를 추적해봐. 포트 번호를 잘 확인해.',
        },
      },
    ],
    interstitial: {
      netstat: [
        { text: '', 'class': '' },
        { text: '[시스템] 네트워크 포트 스캔 결과:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'Proto  Local Address     State       PID/Program', 'class': 'dim', speed: 8 },
        { text: 'tcp    0.0.0.0:22        LISTEN      412/sshd', 'class': 'dim', speed: 8 },
        { text: 'tcp    0.0.0.0:80        LISTEN      623/apache2', 'class': 'dim', speed: 8 },
        { text: 'tcp    0.0.0.0:443       LISTEN      623/apache2', 'class': 'dim', speed: 8 },
        { text: 'tcp    0.0.0.0:3306      LISTEN      891/mysqld', 'class': 'dim', speed: 8 },
        { text: 'tcp    0.0.0.0:4444      LISTEN      8752/???', 'class': 'error', speed: 8 },
        { text: 'tcp    45.33.32.156:6174 ESTABLISHED 6174/kworkerds', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 포트 4444 - 알 수 없는 프로세스가 리스닝 중!', 'class': 'error', delay: 300 },
        { text: '[경고] PID 6174 - 외부 IP로 연결된 의심 프로세스!', 'class': 'error', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] 포트 4444... 리버스 셸의 전형적인 포트야.', 'class': 'commander', delay: 300 },
        { text: '[단장] 저 포트를 누가 열어놨는지 추적해봐!', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      lsof_port: [
        { text: '', 'class': '' },
        { text: '[시스템] 포트 4444 프로세스 추적 결과:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'COMMAND     PID  USER  FD   TYPE  NAME', 'class': 'dim', speed: 8 },
        { text: '.r4tsh3ll  8752  root   3u  IPv4  TCP *:4444 (LISTEN)', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] /tmp/.r4tsh3ll - 리버스 셸 백도어 확인! (PID: 8752)', 'class': 'error', delay: 300 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 찾았다, {name}! 리버스 셸이 포트 4444에서 대기 중이었어.', 'class': 'commander', delay: 300 },
      { text: '[단장] 게다가 PID 6174는 외부로 연결까지 맺고 있군.', 'class': 'commander', delay: 300 },
      { text: '[단장] 먼저 공격자 IP부터 차단하자!', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 2 완료: 네트워크 정찰 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      '열린 포트를 확인하는 명령어: netstat -tulnp',
      '특정 포트의 프로세스 추적: lsof -i :포트번호',
      '1단계: netstat -tulnp | 2단계: lsof -i :4444',
    ],
    next: 'stage_3',
  },

  /* ══════════════════════════════════════════
   * MISSION 3: 공격자 IP 차단
   * ══════════════════════════════════════════ */
  {
    id: 'stage_3',
    title: '임무 3: 공격자 IP 차단',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 공격자 IP 45.33.32.156을 방화벽에서 차단해라, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] iptables로 해당 IP의 모든 인바운드 트래픽을 막아!', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ─────────────────────────────────────┐', 'class': 'objective' },
      { text: '│ iptables로 공격자 IP (45.33.32.156)를 차단하라    │', 'class': 'objective' },
      { text: '└──────────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'block_ip',
        exact: 'iptables -A INPUT -s 45.33.32.156 -j DROP',
        alts: [
          'sudo iptables -A INPUT -s 45.33.32.156 -j DROP',
          'iptables -I INPUT -s 45.33.32.156 -j DROP',
          'sudo iptables -I INPUT -s 45.33.32.156 -j DROP',
          'iptables -A INPUT -s 45.33.32.156 -j REJECT',
          'sudo iptables -A INPUT -s 45.33.32.156 -j REJECT',
        ],
        keywords: ['iptables', '45.33.32.156'],
        pattern: '(sudo\\s+)?iptables\\s+-(A|I)\\s+INPUT\\s+-s\\s+45\\.33\\.32\\.156\\s+-j\\s+(DROP|REJECT)',
        wrongFeedback: {
          partial: 'iptables 명령어는 맞아! INPUT 체인에 -s 로 IP를 지정하고 -j DROP 으로 차단해봐.',
        },
      },
    ],
    interstitial: {
      block_ip: [
        { text: '', 'class': '' },
        { text: '[시스템] 방화벽 규칙 적용 중...', 'class': 'system', delay: 500 },
        { text: '[시스템] iptables: 규칙이 INPUT 체인에 추가되었습니다.', 'class': 'system', delay: 200 },
        { text: '[시스템] 45.33.32.156 → 모든 인바운드 트래픽 차단 완료', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 좋아, {name}. 공격자의 접근 경로를 막았다.', 'class': 'commander', delay: 300 },
      { text: '[단장] 하지만 이미 심어놓은 것들이 있을 거야. 정리하러 가자.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 3 완료: 공격자 IP 차단 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      'iptables로 특정 IP를 차단하는 규칙을 추가하세요.',
      'iptables -A INPUT -s [IP] -j DROP 형식입니다.',
      '정답: iptables -A INPUT -s 45.33.32.156 -j DROP',
    ],
    next: 'stage_4',
  },

  /* ══════════════════════════════════════════
   * MISSION 4: 리버스 셸 제거
   * ══════════════════════════════════════════ */
  {
    id: 'stage_4',
    title: '임무 4: 리버스 셸 제거',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 아까 발견한 리버스 셸 (PID 8752)을 즉시 제거해라!', 'class': 'commander', delay: 300 },
      { text: '[단장] 저놈이 살아있는 한 공격자가 원격으로 명령을 내릴 수 있어.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ───────────────────────────┐', 'class': 'objective' },
      { text: '│ 리버스 셸 프로세스(PID 8752)를 종료하라  │', 'class': 'objective' },
      { text: '└────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'kill_revshell',
        exact: 'kill -9 8752',
        alts: [
          'kill -9 8752', 'sudo kill -9 8752',
          'kill -SIGKILL 8752', 'kill -KILL 8752',
          'sudo kill -SIGKILL 8752',
        ],
        keywords: ['kill', '8752'],
        pattern: '(sudo\\s+)?kill\\s+(-9|-SIGKILL|-KILL)\\s+8752',
        wrongFeedback: {
          partial: 'kill 명령어는 맞아! PID를 정확히 지정하고 -9 옵션으로 강제 종료해봐.',
        },
      },
    ],
    interstitial: {
      kill_revshell: [
        { text: '', 'class': '' },
        { text: '[시스템] 프로세스 종료 신호 전송 중...', 'class': 'system', delay: 400 },
        { text: '[시스템] PID 8752 (.r4tsh3ll) - 강제 종료 완료', 'class': 'system', delay: 200 },
        { text: '[시스템] 포트 4444 - 리스닝 해제 확인', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 리버스 셸을 끊었다. 잘했어, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 그런데... 서버가 왜 이렇게 느리지? CPU 상태를 확인해봐.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 4 완료: 리버스 셸 제거 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      '프로세스를 강제 종료하는 명령어: kill -9 [PID]',
      'PID는 아까 확인한 리버스 셸의 번호입니다.',
      '정답: kill -9 8752',
    ],
    next: 'stage_5',
  },

  /* ══════════════════════════════════════════
   * MISSION 5: 크립토마이너 탐지 & 제거
   * ══════════════════════════════════════════ */
  {
    id: 'stage_5',
    title: '임무 5: 크립토마이너 제거',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 서버 CPU가 거의 100%야. 뭔가 자원을 잡아먹고 있어.', 'class': 'commander', delay: 300 },
      { text: '[단장] top 명령어로 실시간 자원 점유율을 확인해봐!', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ─────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 실시간 CPU 점유율을 확인하라        │', 'class': 'objective' },
      { text: '│ 2단계: 악성 프로세스를 강제 종료하라        │', 'class': 'objective' },
      { text: '└──────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'top',
        exact: 'top',
        alts: ['top', 'sudo top', 'htop', 'sudo htop'],
        keywords: ['top'],
        pattern: '^(sudo\\s+)?(top|htop)$',
      },
      {
        id: 'kill_miner',
        exact: 'kill -9 6174',
        alts: [
          'kill -9 6174', 'sudo kill -9 6174',
          'kill -SIGKILL 6174', 'kill -KILL 6174',
        ],
        keywords: ['kill', '6174'],
        pattern: '(sudo\\s+)?kill\\s+(-9|-SIGKILL|-KILL)\\s+6174',
        wrongFeedback: {
          partial: 'kill 명령어에 PID를 정확히 넣어봐. 아까 top에서 확인한 번호야.',
        },
      },
    ],
    interstitial: {
      top: [
        { text: '', 'class': '' },
        { text: '[시스템] 실시간 시스템 모니터:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'top - 03:35:22 up 51 days, load average: 4.87, 4.92, 4.88', 'class': 'dim', speed: 8 },
        { text: 'Tasks: 127 total,   2 running, 125 sleeping', 'class': 'dim', speed: 8 },
        { text: '%Cpu(s): 98.7 us,  0.8 sy,  0.0 ni,  0.5 id', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '  PID  USER     %CPU %MEM COMMAND', 'class': 'dim', speed: 8 },
        { text: ' 6174  root     98.7  4.2 kworkerds', 'class': 'error', speed: 8 },
        { text: '  412  root      0.3  0.5 sshd', 'class': 'dim', speed: 8 },
        { text: '  623  www-data  0.2  1.8 apache2', 'class': 'dim', speed: 8 },
        { text: '  891  mysql     0.1  3.2 mysqld', 'class': 'dim', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] PID 6174 "kworkerds" - CPU 98.7% 점유! 크립토마이너!', 'class': 'error', delay: 400 },
        { text: '', 'class': '' },
        { text: '[단장] 크립토마이너다! 서버 자원을 도둑질하고 있어.', 'class': 'commander', delay: 300 },
        { text: '[단장] PID 6174를 즉시 죽여라, {name}!', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      kill_miner: [
        { text: '', 'class': '' },
        { text: '[시스템] 프로세스 종료 중...', 'class': 'system', delay: 400 },
        { text: '[시스템] PID 6174 (kworkerds) - 강제 종료 완료', 'class': 'system', delay: 200 },
        { text: '[시스템] CPU 사용률: 98.7% → 2.1% (정상 복구)', 'class': 'success', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] CPU가 정상으로 돌아왔다. 쾌적하군.', 'class': 'commander', delay: 300 },
      { text: '[단장] 그런데 이런 악성코드는 보통 크론잡으로 자동 부활해.', 'class': 'commander', delay: 300 },
      { text: '[단장] 크론 스케줄러를 확인해봐.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 5 완료: 크립토마이너 제거 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      'CPU 점유율을 실시간으로 보는 명령어: top',
      'top 실행 후, 보이는 PID를 kill -9로 종료하세요.',
      '1단계: top | 2단계: kill -9 6174',
    ],
    next: 'stage_6',
  },

  /* ══════════════════════════════════════════
   * MISSION 6: 크론잡 지속성 제거
   * ══════════════════════════════════════════ */
  {
    id: 'stage_6',
    title: '임무 6: 크론잡 지속성 제거',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 악성코드를 죽여도 1분마다 다시 살아나는 경우가 있어.', 'class': 'commander', delay: 300 },
      { text: '[단장] 예약된 작업(크론잡)을 확인해봐, {name}.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ──────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 현재 크론잡 목록을 확인하라      │', 'class': 'objective' },
      { text: '│ 2단계: 악성 크론잡을 제거하라           │', 'class': 'objective' },
      { text: '└───────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'crontab_list',
        exact: 'crontab -l',
        alts: ['crontab -l', 'sudo crontab -l', 'crontab -l -u root', 'sudo crontab -l -u root'],
        keywords: ['crontab', '-l'],
        pattern: '(sudo\\s+)?crontab\\s+(-l|-e|--list)',
      },
      {
        id: 'crontab_remove',
        exact: 'crontab -r',
        alts: ['crontab -r', 'sudo crontab -r', 'crontab -r -u root'],
        keywords: ['crontab', '-r'],
        pattern: '(sudo\\s+)?crontab\\s+(-r|--remove)',
        wrongFeedback: {
          partial: '크론잡을 제거하려면 crontab에 올바른 옵션을 줘야 해.',
        },
      },
    ],
    interstitial: {
      crontab_list: [
        { text: '', 'class': '' },
        { text: '[시스템] root 크론잡 목록:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: '# m h dom mon dow   command', 'class': 'dim', speed: 8 },
        { text: '0 2 * * * /usr/bin/logrotate /etc/logrotate.conf', 'class': 'dim', speed: 8 },
        { text: '*/1 * * * * /tmp/.update.sh >/dev/null 2>&1', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 의심스러운 크론잡 발견!', 'class': 'error', delay: 300 },
        { text: '[경고] 매 1분마다 /tmp/.update.sh 실행 → 악성코드 자동 부활 스크립트!', 'class': 'error', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] 이거야! 이놈 때문에 죽여도 다시 살아난 거야.', 'class': 'commander', delay: 300 },
        { text: '[단장] 크론잡을 전부 제거해라!', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      crontab_remove: [
        { text: '', 'class': '' },
        { text: '[시스템] 크론잡 제거 중...', 'class': 'system', delay: 400 },
        { text: '[시스템] root 사용자의 크론탭이 삭제되었습니다.', 'class': 'system', delay: 200 },
        { text: '[시스템] 정상 크론잡(logrotate)은 시스템 레벨에서 별도 관리됩니다.', 'class': 'dim', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 좋아, 자동 부활 메커니즘을 끊었다.', 'class': 'commander', delay: 300 },
      { text: '[단장] 이제 놈이 남긴 계정을 확인해볼 차례야.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 6 완료: 크론잡 지속성 제거 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      '예약된 작업 목록 확인: crontab -l',
      '크론잡 전체 삭제: crontab -r',
      '1단계: crontab -l | 2단계: crontab -r',
    ],
    next: 'stage_7',
  },

  /* ══════════════════════════════════════════
   * MISSION 7: 유령 계정 & SUID 백도어
   * ══════════════════════════════════════════ */
  {
    id: 'stage_7',
    title: '임무 7: 유령 계정 & 백도어 색출',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 해커들은 보통 재침입을 위한 계정을 몰래 만들어둬.', 'class': 'commander', delay: 300 },
      { text: '[단장] 시스템 계정 목록을 확인해서 수상한 놈이 없는지 봐, {name}.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ──────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 시스템 사용자 계정 목록을 확인하라    │', 'class': 'objective' },
      { text: '│ 2단계: SUID 권한이 설정된 파일을 검색하라    │', 'class': 'objective' },
      { text: '│ 3단계: 악성 SUID 백도어 파일을 삭제하라      │', 'class': 'objective' },
      { text: '└───────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'check_passwd',
        exact: 'cat /etc/passwd',
        alts: [
          'cat /etc/passwd', 'sudo cat /etc/passwd',
          'less /etc/passwd', 'more /etc/passwd',
          'grep -v nologin /etc/passwd',
        ],
        keywords: ['passwd'],
        pattern: '(sudo\\s+)?(cat|less|more|grep.*)\\s+.*(/etc/passwd)',
      },
      {
        id: 'find_suid',
        exact: 'find / -perm -4000 -type f',
        alts: [
          'find / -perm -4000 -type f',
          'sudo find / -perm -4000 -type f',
          'find / -perm -u=s -type f',
          'sudo find / -perm -u=s -type f',
          'find / -perm -4000',
          'sudo find / -perm -4000',
        ],
        keywords: ['find', '4000'],
        pattern: '(sudo\\s+)?find\\s+/\\s+.*(-perm\\s+(-4000|-u=s))',
        wrongFeedback: {
          partial: 'find 명령어로 SUID 파일을 검색해봐. -perm 옵션을 활용해.',
        },
      },
      {
        id: 'rm_suid_backdoor',
        exact: 'rm /usr/local/bin/.sysupdate',
        alts: [
          'rm /usr/local/bin/.sysupdate',
          'sudo rm /usr/local/bin/.sysupdate',
          'rm -f /usr/local/bin/.sysupdate',
          'sudo rm -f /usr/local/bin/.sysupdate',
        ],
        keywords: ['rm', '.sysupdate'],
        pattern: '(sudo\\s+)?rm\\s+(-f\\s+)?/usr/local/bin/\\.sysupdate',
      },
    ],
    interstitial: {
      check_passwd: [
        { text: '', 'class': '' },
        { text: '[시스템] /etc/passwd 출력:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'root:x:0:0:root:/root:/bin/bash', 'class': 'dim', speed: 8 },
        { text: 'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin', 'class': 'dim', speed: 8 },
        { text: 'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin', 'class': 'dim', speed: 8 },
        { text: 'mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false', 'class': 'dim', speed: 8 },
        { text: 'sshd:x:74:74:sshd:/var/run/sshd:/usr/sbin/nologin', 'class': 'dim', speed: 8 },
        { text: 'support_admin:x:0:0::/home/support_admin:/bin/bash', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 유령 계정 발견: support_admin (UID 0 = root 권한!)', 'class': 'error', delay: 400 },
        { text: '', 'class': '' },
        { text: '[단장] UID 0... root와 동일한 권한의 계정을 만들어놨군.', 'class': 'commander', delay: 300 },
        { text: '[시스템] 유령 계정 support_admin 자동 삭제 처리 중...', 'class': 'system', delay: 300 },
        { text: '[시스템] 계정 삭제 완료. 관련 홈 디렉토리도 정리됨.', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] 좋아. 그런데 SUID 백도어도 확인해야 해.', 'class': 'commander', delay: 300 },
        { text: '[단장] SUID가 설정된 파일을 찾아봐. 일반 유저도 root 권한으로 실행되는 파일이야.', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      find_suid: [
        { text: '', 'class': '' },
        { text: '[시스템] SUID 파일 검색 중... (시간이 걸릴 수 있습니다)', 'class': 'system', delay: 600 },
        { text: '', 'class': '' },
        { text: '/usr/bin/passwd', 'class': 'dim', speed: 8 },
        { text: '/usr/bin/sudo', 'class': 'dim', speed: 8 },
        { text: '/usr/bin/su', 'class': 'dim', speed: 8 },
        { text: '/usr/bin/newgrp', 'class': 'dim', speed: 8 },
        { text: '/usr/bin/chsh', 'class': 'dim', speed: 8 },
        { text: '/usr/local/bin/.sysupdate', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 의심 파일: /usr/local/bin/.sysupdate (SUID + 숨김 파일)', 'class': 'error', delay: 300 },
        { text: '', 'class': '' },
        { text: '[단장] .sysupdate... 이름을 교묘하게 위장했군. 삭제해!', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      rm_suid_backdoor: [
        { text: '', 'class': '' },
        { text: '[시스템] 파일 삭제 중...', 'class': 'system', delay: 400 },
        { text: '[시스템] /usr/local/bin/.sysupdate - 삭제 완료', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 유령 계정과 SUID 백도어까지 제거했다, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 다음은 웹 서버 쪽이야. 웹셸이 심어져 있을 수도 있어.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 7 완료: 유령 계정 & 백도어 색출 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      '시스템 계정 확인: cat /etc/passwd',
      'SUID 파일 검색: find / -perm -4000 -type f',
      '1: cat /etc/passwd | 2: find / -perm -4000 -type f | 3: rm /usr/local/bin/.sysupdate',
    ],
    next: 'stage_8',
  },

  /* ══════════════════════════════════════════
   * MISSION 8: 웹셸 탐지 & 제거
   * ══════════════════════════════════════════ */
  {
    id: 'stage_8',
    title: '임무 8: 웹셸 제거',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 웹 서버 디렉토리에 최근 수정된 파일이 없는지 확인해봐.', 'class': 'commander', delay: 300 },
      { text: '[단장] 해커가 웹셸을 심어놨을 가능성이 높아, {name}.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ───────────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 웹 디렉토리에서 최근 수정 파일을 검색하라  │', 'class': 'objective' },
      { text: '│ 2단계: 발견된 웹셸을 삭제하라                    │', 'class': 'objective' },
      { text: '└────────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'find_webshell',
        exact: 'find /var/www/html -mtime -1',
        alts: [
          'find /var/www/html -mtime -1',
          'sudo find /var/www/html -mtime -1',
          'find /var/www/html -mtime -1 -type f',
          'find /var/www -mtime -1',
          'find /var/www/html -newer /etc/passwd',
          'find /var/www/html -mmin -1440',
        ],
        keywords: ['find', '/var/www'],
        pattern: '(sudo\\s+)?find\\s+/var/www.*(-mtime|-mmin|-newer)',
        wrongFeedback: {
          partial: 'find로 웹 디렉토리를 검색해봐. -mtime 옵션으로 최근 수정 파일을 찾을 수 있어.',
        },
      },
      {
        id: 'rm_webshell',
        exact: 'rm /var/www/html/uploads/cmd.php',
        alts: [
          'rm /var/www/html/uploads/cmd.php',
          'sudo rm /var/www/html/uploads/cmd.php',
          'rm -f /var/www/html/uploads/cmd.php',
          'sudo rm -f /var/www/html/uploads/cmd.php',
        ],
        keywords: ['rm', 'cmd.php'],
        pattern: '(sudo\\s+)?rm\\s+(-f\\s+)?/var/www/html/uploads/cmd\\.php',
      },
    ],
    interstitial: {
      find_webshell: [
        { text: '', 'class': '' },
        { text: '[시스템] 최근 24시간 내 수정된 파일 검색 중...', 'class': 'system', delay: 500 },
        { text: '', 'class': '' },
        { text: '/var/www/html/index.html', 'class': 'dim', speed: 8 },
        { text: '/var/www/html/uploads/cmd.php', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 웹셸 발견: /var/www/html/uploads/cmd.php', 'class': 'error', delay: 300 },
        { text: '[경고] 이 파일을 통해 웹에서 시스템 명령어를 실행할 수 있습니다!', 'class': 'error', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] 웹셸이다! 이걸로 외부에서 서버를 조종할 수 있어.', 'class': 'commander', delay: 300 },
        { text: '[단장] 즉시 삭제해라!', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      rm_webshell: [
        { text: '', 'class': '' },
        { text: '[시스템] 웹셸 삭제 중...', 'class': 'system', delay: 400 },
        { text: '[시스템] /var/www/html/uploads/cmd.php - 삭제 완료', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 웹셸까지 제거했다. 깔끔하군, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 이제 근본적인 취약점을 막을 차례야. SSH 설정을 강화하자.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 8 완료: 웹셸 제거 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      '최근 수정된 파일 검색: find [디렉토리] -mtime -1',
      '웹 디렉토리는 /var/www/html 입니다.',
      '1단계: find /var/www/html -mtime -1 | 2단계: rm /var/www/html/uploads/cmd.php',
    ],
    next: 'stage_9',
  },

  /* ══════════════════════════════════════════
   * MISSION 9: SSH 보안 강화
   * ══════════════════════════════════════════ */
  {
    id: 'stage_9',
    title: '임무 9: SSH 보안 강화',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 이번 공격의 시작은 SSH 브루트포스였어.', 'class': 'commander', delay: 300 },
      { text: '[단장] root 직접 로그인이 허용되어 있었던 게 원인이야.', 'class': 'commander', delay: 300 },
      { text: '[단장] SSH 설정 파일을 수정해서 root 로그인을 막아라, {name}.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ──────────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: SSH 설정 파일을 열어라                    │', 'class': 'objective' },
      { text: '│ 2단계: PermitRootLogin을 no로 변경하라           │', 'class': 'objective' },
      { text: '│ 3단계: SSH 서비스를 재시작하라                    │', 'class': 'objective' },
      { text: '└───────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'open_sshd',
        exact: 'vi /etc/ssh/sshd_config',
        alts: [
          'vi /etc/ssh/sshd_config', 'vim /etc/ssh/sshd_config',
          'nano /etc/ssh/sshd_config', 'cat /etc/ssh/sshd_config',
          'sudo vi /etc/ssh/sshd_config', 'sudo vim /etc/ssh/sshd_config',
          'sudo nano /etc/ssh/sshd_config', 'sudo cat /etc/ssh/sshd_config',
        ],
        keywords: ['sshd_config'],
        pattern: '(sudo\\s+)?(vi|vim|nano|cat|less|more)\\s+/etc/ssh/sshd_config',
      },
      {
        id: 'set_no_root',
        exact: 'PermitRootLogin no',
        alts: ['permitrootlogin no', 'PermitRootLogin no', 'set PermitRootLogin no'],
        keywords: ['permitrootlogin', 'no'],
        pattern: '(set\\s+)?[Pp]ermit[Rr]oot[Ll]ogin\\s+no',
      },
      {
        id: 'restart_ssh',
        exact: 'systemctl restart sshd',
        alts: [
          'systemctl restart sshd', 'sudo systemctl restart sshd',
          'service sshd restart', 'sudo service sshd restart',
          'systemctl restart ssh', 'sudo systemctl restart ssh',
          'service ssh restart', 'sudo service ssh restart',
        ],
        keywords: ['restart', 'ssh'],
        pattern: '(sudo\\s+)?(systemctl\\s+restart\\s+ssh(d)?|service\\s+ssh(d)?\\s+restart)',
      },
    ],
    interstitial: {
      open_sshd: [
        { text: '', 'class': '' },
        { text: '[시스템] /etc/ssh/sshd_config 열기...', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: '# /etc/ssh/sshd_config', 'class': 'dim', speed: 8 },
        { text: 'Port 22', 'class': 'dim', speed: 8 },
        { text: 'Protocol 2', 'class': 'dim', speed: 8 },
        { text: 'PermitRootLogin yes    # <-- 취약점!', 'class': 'error', speed: 8 },
        { text: 'PasswordAuthentication yes', 'class': 'dim', speed: 8 },
        { text: 'MaxAuthTries 6', 'class': 'dim', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] PermitRootLogin이 yes로 설정됨!', 'class': 'error', delay: 300 },
        { text: '', 'class': '' },
        { text: '[단장] 저거다! PermitRootLogin을 no로 바꿔라.', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      set_no_root: [
        { text: '', 'class': '' },
        { text: '[시스템] 설정 변경: PermitRootLogin yes → no', 'class': 'system', delay: 300 },
        { text: '[시스템] 파일 저장 완료', 'class': 'system', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] 좋아. 이제 SSH 서비스를 재시작해서 적용해.', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      restart_ssh: [
        { text: '', 'class': '' },
        { text: '[시스템] SSH 서비스 재시작 중...', 'class': 'system', delay: 600 },
        { text: '[시스템]   Active: active (running)', 'class': 'success', speed: 10 },
        { text: '[시스템] Root 직접 로그인 차단 적용 완료', 'class': 'success', delay: 200 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] 완벽하다, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 같은 방법으로는 다시는 못 들어와.', 'class': 'commander', delay: 300 },
      { text: '[단장] 마지막으로 한 가지만 더 하자. 놈의 정체를 밝혀내야 해.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 9 완료: SSH 보안 강화 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      'SSH 설정 파일: /etc/ssh/sshd_config',
      '1: vi /etc/ssh/sshd_config | 2: PermitRootLogin no',
      '1: vi /etc/ssh/sshd_config | 2: PermitRootLogin no | 3: systemctl restart sshd',
    ],
    next: 'stage_10',
  },

  /* ══════════════════════════════════════════
   * MISSION 10: 포렌식 분석 & 암호 해독
   * ══════════════════════════════════════════ */
  {
    id: 'stage_10',
    title: '임무 10: 포렌식 분석',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '[단장] 마지막 임무다, {name}.', 'class': 'commander', delay: 300 },
      { text: '[단장] 아까 제거한 리버스 셸 바이너리(/tmp/.r4tsh3ll)에서 정보를 추출하자.', 'class': 'commander', delay: 300 },
      { text: '[단장] strings 명령어로 바이너리 안의 문자열을 뽑아서 해커 그룹 시그니처를 찾아라.', 'class': 'commander', delay: 300 },
      { text: '[단장] 정보원에 따르면 "Gashiga"라는 조직이 의심된다.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
    ],
    objective: [
      { text: '┌─ 임무 목표 ──────────────────────────────────────┐', 'class': 'objective' },
      { text: '│ 1단계: 바이너리에서 해커 그룹 시그니처를 검색하라     │', 'class': 'objective' },
      { text: '│ 2단계: 발견된 Base64 암호문을 해독하라               │', 'class': 'objective' },
      { text: '└───────────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '' },
    ],
    commands: [
      {
        id: 'strings_grep',
        exact: 'strings /tmp/.r4tsh3ll | grep Gashiga',
        alts: [
          'strings /tmp/.r4tsh3ll | grep Gashiga',
          'strings /tmp/.r4tsh3ll | grep gashiga',
          'strings /tmp/.r4tsh3ll | grep -i gashiga',
          'sudo strings /tmp/.r4tsh3ll | grep Gashiga',
          'strings /tmp/.r4tsh3ll | grep -i Gashiga',
        ],
        keywords: ['strings', 'gashiga'],
        pattern: '(sudo\\s+)?strings\\s+/tmp/\\.r4tsh3ll\\s*\\|\\s*grep\\s+(-i\\s+)?[Gg]ashiga',
        wrongFeedback: {
          partial: 'strings와 grep을 파이프(|)로 연결해서 사용해봐.',
        },
      },
      {
        id: 'base64_decode',
        exact: 'echo TmV4dDogU0NBREE= | base64 -d',
        alts: [
          'echo TmV4dDogU0NBREE= | base64 -d',
          'echo TmV4dDogU0NBREE= | base64 --decode',
          'echo "TmV4dDogU0NBREE=" | base64 -d',
          "echo 'TmV4dDogU0NBREE=' | base64 -d",
          'base64 -d <<< TmV4dDogU0NBREE=',
        ],
        keywords: ['base64', 'TmV4dDogU0NBREE'],
        pattern: '(echo\\s+["\']?TmV4dDogU0NBREE=?["\']?\\s*\\|\\s*base64\\s+(-d|--decode)|base64\\s+(-d|--decode)\\s*<<<\\s*TmV4dDogU0NBREE=?)',
        wrongFeedback: {
          partial: 'echo로 Base64 문자열을 출력하고 파이프(|)로 base64 -d에 전달해봐.',
        },
      },
    ],
    interstitial: {
      strings_grep: [
        { text: '', 'class': '' },
        { text: '[시스템] 바이너리 문자열 추출 및 필터링 중...', 'class': 'system', delay: 500 },
        { text: '', 'class': '' },
        { text: 'Gashiga_APT_Group_v2.1', 'class': 'error', speed: 8 },
        { text: 'Gashiga_C2_beacon_interval=60', 'class': 'error', speed: 8 },
        { text: 'Gashiga_next_target=TmV4dDogU0NBREE=', 'class': 'error', speed: 8 },
        { text: '', 'class': '' },
        { text: '[경고] 해커 그룹 확인: Gashiga APT Group (버전 2.1)', 'class': 'error', delay: 400 },
        { text: '[경고] C2 서버 비콘 주기: 60초', 'class': 'error', delay: 200 },
        { text: '[경고] 다음 타겟이 Base64로 인코딩되어 있음!', 'class': 'error', delay: 200 },
        { text: '', 'class': '' },
        { text: '[단장] Gashiga... 드디어 꼬리가 잡혔군.', 'class': 'commander', delay: 300 },
        { text: '[단장] 저 Base64 문자열을 해독해봐, {name}!', 'class': 'commander', delay: 300 },
        { text: '[단장] 문자열: TmV4dDogU0NBREE=', 'class': 'commander', delay: 300 },
        { text: '', 'class': '' },
      ],
      base64_decode: [
        { text: '', 'class': '' },
        { text: '[시스템] Base64 디코딩 결과:', 'class': 'system', delay: 400 },
        { text: '', 'class': '' },
        { text: 'Next: SCADA', 'class': 'error', speed: 15 },
        { text: '', 'class': '' },
        { text: '[경고] 다음 공격 목표: SCADA 시스템 (산업제어시스템)!', 'class': 'error', delay: 500 },
        { text: '', 'class': '' },
      ],
    },
    success: [
      { text: '[단장] ...SCADA 시스템이 다음 타겟이라고?', 'class': 'commander', delay: 400 },
      { text: '[단장] 이건 큰 건이야. 이 정보를 상부에 즉시 보고하겠다.', 'class': 'commander', delay: 300 },
      { text: '[단장] {name}, 네가 해낸 거야. 대단하다.', 'class': 'commander', delay: 400 },
      { text: '', 'class': '' },
      { text: '✓ 임무 10 완료: 포렌식 분석 성공', 'class': 'success', delay: 500 },
      { text: '', 'class': '' },
    ],
    hints: [
      'strings [파일] | grep [키워드] 로 바이너리에서 문자열을 검색할 수 있습니다.',
      '1단계: strings /tmp/.r4tsh3ll | grep Gashiga',
      '2단계: echo TmV4dDogU0NBREE= | base64 -d',
    ],
    next: 'stage_ending',
  },

  /* ══════════════════════════════════════════
   * ENDING: 작전 완료
   * ══════════════════════════════════════════ */
  {
    id: 'stage_ending',
    title: '작전 완료',
    briefing: [
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '═══════════════════════════════════════════', 'class': 'success' },
      { text: '  OPERATION: WHITE SHIELD - 작전 완료', 'class': 'success' },
      { text: '═══════════════════════════════════════════', 'class': 'success' },
      { text: '', 'class': '', delay: 500 },
      { text: '┌─ 작전 결과 보고서 ─────────────────────────────┐', 'class': 'objective' },
      { text: '│                                                │', 'class': 'objective' },
      { text: '│  요원: {name}                                  │', 'class': 'objective', speed: 15 },
      { text: '│                                                │', 'class': 'objective' },
      { text: '│  [✓] 임무 1:  침입 흔적 분석      - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 2:  네트워크 정찰        - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 3:  공격자 IP 차단       - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 4:  리버스 셸 제거       - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 5:  크립토마이너 제거     - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 6:  크론잡 지속성 제거    - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 7:  유령 계정 & 백도어    - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 8:  웹셸 제거            - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 9:  SSH 보안 강화        - 완료        │', 'class': 'success', speed: 12 },
      { text: '│  [✓] 임무 10: 포렌식 분석          - 완료        │', 'class': 'success', speed: 12 },
      { text: '│                                                │', 'class': 'objective' },
      { text: '│  위협 그룹: Gashiga APT Group                  │', 'class': 'error', speed: 12 },
      { text: '│  차기 목표: SCADA 시스템 (정보 상부 전달 완료)    │', 'class': 'error', speed: 12 },
      { text: '│                                                │', 'class': 'objective' },
      { text: '│  작전 상태: ██████████ 성공                     │', 'class': 'success' },
      { text: '│                                                │', 'class': 'objective' },
      { text: '└────────────────────────────────────────────────┘', 'class': 'objective' },
      { text: '', 'class': '', delay: 600 },
      { text: '[단장] {name}, 오늘 네가 수행한 작업을 정리하면:', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
      { text: '  1. grep으로 브루트포스 공격 로그 분석', 'class': 'narrator', speed: 18 },
      { text: '  2. netstat/lsof로 백도어 네트워크 연결 추적', 'class': 'narrator', speed: 18 },
      { text: '  3. iptables로 공격자 IP 원천 봉쇄', 'class': 'narrator', speed: 18 },
      { text: '  4. 리버스 셸 & 크립토마이너 프로세스 제거', 'class': 'narrator', speed: 18 },
      { text: '  5. 크론잡 자동 부활 메커니즘 차단', 'class': 'narrator', speed: 18 },
      { text: '  6. SUID 백도어 & 유령 계정 색출 제거', 'class': 'narrator', speed: 18 },
      { text: '  7. 웹셸 탐지 및 삭제', 'class': 'narrator', speed: 18 },
      { text: '  8. SSH 설정 강화로 재침투 방지', 'class': 'narrator', speed: 18 },
      { text: '  9. 포렌식 분석으로 위협 그룹 & 차기 공격 목표 식별', 'class': 'narrator', speed: 18 },
      { text: '', 'class': '' },
      { text: '[단장] 이것이 바로 화이트 해커가 하는 일이다.', 'class': 'commander', delay: 400 },
      { text: '[단장] 공격자보다 한 발 앞서 시스템을 지키는 것.', 'class': 'commander', delay: 300 },
      { text: '[단장] 수고했다, {name}. 다음 작전에서 또 보자.', 'class': 'commander', delay: 300 },
      { text: '', 'class': '' },
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '  Operation: White Shield - END', 'class': 'ascii-art', delay: 300 },
      { text: '  화이트 해커의 길은 계속됩니다...', 'class': 'narrator', delay: 300 },
      { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'class': 'dim' },
      { text: '', 'class': '' },
      { text: '게임을 다시 시작하려면 페이지를 새로고침하세요.', 'class': 'dim' },
    ],
    objective: [],
    commands: [],
    interstitial: {},
    success: [],
    hints: [],
    next: null,
  },
];
