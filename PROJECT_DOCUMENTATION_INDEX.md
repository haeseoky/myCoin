# MyCoin 프로젝트 문서 인덱스

## 📋 프로젝트 개요

**MyCoin**은 교육 목적으로 개발된 ERC-20 표준 토큰 프로젝트입니다. 블록체인 초보자가 스마트 컨트랙트 개발부터 배포까지 전 과정을 학습할 수 있도록 구성되었습니다.

---

## 📚 핵심 문서

### 1. 프로젝트 메인 문서
- **[README.md](./README.md)**
  - 프로젝트 전체 개요 및 사용법
  - 설치 방법, 테스트 실행, 배포 가이드
  - 토큰 기능 설명 및 기술 스택 정보
  - 34개 테스트 케이스 결과 요약

### 2. 블록체인 학습 가이드
- **[blockchain-study-guide.md](./blockchain-study-guide.md)**
  - 블록체인 기초 개념부터 고급 내용까지
  - 7개 섹션으로 구성된 체계적 학습 커리큘럼
  - 합의 알고리즘(PoW, PoS, DPoS) 상세 설명
  - P2P 네트워크 전파 메커니즘 기술적 분석

---

## 🔧 프로젝트 구조

### 📁 스마트 컨트랙트
```
contracts/
├── HelloWorld.sol     # 기초 학습용 컨트랙트
└── MyCoin.sol         # 메인 ERC-20 토큰 컨트랙트
```

#### HelloWorld.sol
- **목적**: 솔리디티 기초 문법 학습
- **기능**: 메시지 저장/조회, 카운터, 소유자 권한 관리
- **학습 포인트**: 상태 변수, 이벤트, 모디파이어, 접근 제어

#### MyCoin.sol  
- **목적**: 실제 사용 가능한 ERC-20 토큰 구현
- **핵심 기능**:
  - ERC-20 표준 함수 (transfer, approve, transferFrom)
  - 관리자 기능 (mint, burn, pause/unpause)
  - 에어드랍 기능 (airdrop, airdropEqual)
  - 소유권 이전 (transferOwnership)
- **보안 기능**: 영주소 차단, 오버플로우 방지, 일시정지 메커니즘

### 🧪 테스트 스위트
```
test/
├── HelloWorld.test.js  # 기초 컨트랙트 테스트
└── MyCoin.test.js      # 종합 토큰 테스트 (34개 케이스)
```

#### 테스트 커버리지
- **배포 테스트**: 5개 (토큰 정보, 초기 공급량, 소유권)
- **ERC-20 기본**: 4개 (전송, 잔고 부족, 영주소 차단, 이벤트)
- **승인/위임**: 4개 (승인, 위임 전송, 한도 초과, 이벤트)
- **토큰 발행**: 3개 (발행, 권한 확인, 이벤트)
- **토큰 소각**: 4개 (소각, 잔고 확인, 관리자 소각, 이벤트)
- **일시 정지**: 4개 (정지/해제, 전송 차단, 권한 확인)
- **에어드랍**: 3개 (동일 수량, 다른 수량, 배열 검증)
- **조회 함수**: 3개 (토큰 정보, 사용자 정보, 단위 변환)
- **소유권 이전**: 4개 (이전, 새 권한, 이전 권한 상실, 이벤트)

### 📜 배포 스크립트
```
scripts/
├── deploy.js          # 기본 배포 스크립트
└── deployMyCoin.js    # 종합 배포 및 기능 테스트
```

#### deployMyCoin.js 기능
- 토큰 배포 및 초기 상태 확인
- 4단계 기능 테스트 자동 실행:
  1. 토큰 전송 테스트
  2. 승인 및 위임 전송 테스트  
  3. 토큰 발행 테스트
  4. 에어드랍 테스트
- 최종 상태 요약 및 사용법 가이드

---

## ⚙️ 개발 환경 설정

### 필수 도구
- **Node.js**: v16 이상
- **NPM**: Node.js 패키지 매니저
- **Hardhat**: 이더리움 개발 프레임워크
- **VSCode**: 권장 IDE (Solidity 확장 포함)

### 프로젝트 설정 파일
- **[package.json](./package.json)**: NPM 의존성 및 스크립트
- **[hardhat.config.js](./hardhat.config.js)**: Hardhat 설정 (Solidity 0.8.19, 최적화)
- **[.gitignore](./.gitignore)**: Git 제외 파일 목록

### 사용 가능한 명령어
```bash
npm run compile      # 솔리디티 컨트랙트 컴파일
npm run test        # 테스트 실행 (34개 케이스)
npm run deploy      # 로컬 네트워크에 배포
npm run node        # 로컬 블록체인 네트워크 시작
npm run clean       # 캐시 및 artifacts 정리
```

---

## 📖 학습 로드맵

### Phase 1: 블록체인 기초 이해
1. **블록체인 개념** (blockchain-study-guide.md 섹션 1-2)
   - 탈중앙화, 불변성, 투명성
   - 기존 데이터베이스와의 차이점

2. **기술적 메커니즘** (blockchain-study-guide.md 섹션 3-4)
   - 스마트 컨트랙트 실행 주체
   - Gas Fee 지불 구조

3. **합의 알고리즘** (blockchain-study-guide.md 섹션 5-7)
   - PoW, PoS, DPoS 비교
   - P2P 네트워크 전파
   - PoS 투표 메커니즘

### Phase 2: 개발 환경 구축
1. **환경 설정** (README.md 설치 섹션)
   - Node.js, NPM 설치
   - Hardhat 프레임워크 설정
   - VSCode 확장 설치

2. **프로젝트 구조 이해**
   - contracts, test, scripts 폴더 역할
   - package.json 스크립트 활용법

### Phase 3: 스마트 컨트랙트 개발
1. **기초 학습** (HelloWorld.sol)
   - 솔리디티 기본 문법
   - 상태 변수, 함수, 이벤트
   - 접근 제어 모디파이어

2. **실전 개발** (MyCoin.sol)
   - ERC-20 표준 구현
   - 보안 고려사항
   - 확장 기능 개발

### Phase 4: 테스트 및 배포
1. **테스트 작성** (test 폴더)
   - Mocha/Chai 테스트 프레임워크
   - 엣지 케이스 테스트
   - 이벤트 검증

2. **배포 및 검증** (scripts 폴더)
   - 로컬 네트워크 배포
   - 기능 테스트 자동화
   - 실제 사용 시나리오 검증

---

## 🔗 외부 리소스

### GitHub 저장소
- **Repository**: [https://github.com/haeseoky/myCoin](https://github.com/haeseoky/myCoin)
- **Issues**: 버그 리포트 및 기능 제안
- **Pull Requests**: 코드 기여

### 관련 문서
- **Solidity 공식 문서**: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)
- **Hardhat 문서**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **ERC-20 표준**: [https://eips.ethereum.org/EIPS/eip-20](https://eips.ethereum.org/EIPS/eip-20)

---

## 📊 프로젝트 통계

### 코드 메트릭스
- **스마트 컨트랙트**: 2개 파일
- **테스트 케이스**: 34개 (100% 통과)
- **배포 스크립트**: 2개 파일
- **문서 페이지**: 2개 (이 인덱스 포함 3개)

### 기능 완성도
- ✅ ERC-20 표준 완벽 구현
- ✅ 고급 기능 (발행, 소각, 일시정지, 에어드랍)
- ✅ 포괄적 테스트 스위트
- ✅ 자동화된 배포 및 검증
- ✅ 상세한 학습 가이드

### 보안 검증
- ✅ 오버플로우/언더플로우 방지
- ✅ 재진입 공격 방지
- ✅ 접근 제어 구현
- ✅ 영주소 전송 차단
- ✅ 일시정지 메커니즘

---

## 🎯 다음 단계

### 확장 가능한 기능
- [ ] 테스트넷 배포 (Sepolia, Goerli)
- [ ] 웹 인터페이스 개발 (React/Vue)
- [ ] MetaMask 연동
- [ ] 멀티시그 지갑 지원
- [ ] 스테이킹 메커니즘
- [ ] 거버넌스 투표 시스템

### 고급 주제 학습
- [ ] 가스 최적화 기법
- [ ] 업그레이더블 컨트랙트 패턴
- [ ] 크로스체인 브리지
- [ ] Layer 2 솔루션 통합
- [ ] DeFi 프로토콜 개발

---

**📝 마지막 업데이트**: 2024년 8월 2일  
**📧 문의**: GitHub Issues를 통해 연락주세요  
**🏷️ 라이선스**: MIT License

---

*이 문서는 MyCoin 프로젝트의 모든 구성 요소를 체계적으로 정리한 마스터 인덱스입니다. 각 섹션의 링크를 통해 상세 정보에 접근할 수 있습니다.*