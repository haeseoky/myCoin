# MyCoin - ERC-20 토큰 프로젝트

## 📖 프로젝트 소개

**MyCoin (MYC)**은 이더리움 블록체인에서 작동하는 ERC-20 표준 토큰입니다. 이 프로젝트는 블록체인과 스마트 컨트랙트 개발 학습을 위해 만들어졌습니다.

## ✨ 주요 기능

### 🪙 ERC-20 기본 기능
- ✅ 토큰 전송 (transfer)
- ✅ 토큰 승인 (approve)
- ✅ 위임 전송 (transferFrom)
- ✅ 잔고 조회 (balanceOf)
- ✅ 총 공급량 조회 (totalSupply)

### 🛡️ 보안 및 관리 기능
- ✅ 소유자 권한 관리 (onlyOwner)
- ✅ 토큰 전송 일시 정지/재개
- ✅ 영주소 전송 방지
- ✅ 오버플로우/언더플로우 방지

### ⚡ 확장 기능
- ✅ 토큰 발행 (mint)
- ✅ 토큰 소각 (burn)
- ✅ 에어드랍 (airdrop)
- ✅ 소유권 이전 (transferOwnership)

## 🔧 기술 스택

- **Solidity**: 0.8.19
- **Hardhat**: 개발 프레임워크
- **Ethers.js**: 이더리움 상호작용 라이브러리
- **Mocha/Chai**: 테스트 프레임워크
- **Node.js**: 런타임 환경

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd myCoin
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 컴파일
```bash
npm run compile
```

### 4. 테스트 실행
```bash
npm run test
```

### 5. 로컬 배포
```bash
npm run deploy
```

## 📝 사용 가능한 스크립트

```bash
npm run compile      # 솔리디티 컨트랙트 컴파일
npm run test        # 테스트 실행
npm run deploy      # 로컬 네트워크에 배포
npm run deploy:local # 로컬 노드에 배포
npm run node        # 로컬 블록체인 네트워크 시작
npm run clean       # 캐시 및 artifacts 정리
```

## 🧪 테스트 결과

34개의 테스트가 모두 통과하여 컨트랙트의 안정성을 검증했습니다.

```
✔ 배포 테스트 (5개)
✔ ERC-20 기본 기능 (4개)
✔ 승인 및 위임 전송 (4개)
✔ 토큰 발행 (3개)
✔ 토큰 소각 (4개)
✔ 일시 정지 기능 (4개)
✔ 에어드랍 기능 (3개)
✔ 조회 함수들 (3개)
✔ 소유권 이전 (4개)
```

## 📊 토큰 정보

| 속성 | 값 |
|------|-----|
| 이름 | My Coin |
| 심볼 | MYC |
| 소수점 | 18 |
| 초기 발행량 | 1,000,000 MYC |
| 표준 | ERC-20 |

## 🏗️ 프로젝트 구조

```
myCoin/
├── contracts/              # 스마트 컨트랙트
│   ├── HelloWorld.sol     # 학습용 기본 컨트랙트
│   └── MyCoin.sol         # 메인 토큰 컨트랙트
├── test/                  # 테스트 파일
│   ├── HelloWorld.test.js
│   └── MyCoin.test.js
├── scripts/               # 배포 스크립트
│   ├── deploy.js
│   └── deployMyCoin.js
├── hardhat.config.js      # Hardhat 설정
├── package.json
├── README.md
└── blockchain-study-guide.md  # 학습 가이드
```

## 🔐 보안 기능

### 접근 제어
- `onlyOwner`: 소유자만 관리 기능 사용 가능
- `whenNotPaused`: 일시 정지 상태에서 전송 차단
- `validAddress`: 영주소 전송 방지

### 입력 검증
- 잔고 부족 시 전송 실패
- 승인량 초과 시 위임 전송 실패
- 배열 길이 불일치 시 에어드랍 실패

## 💡 주요 함수들

### 기본 ERC-20 함수
```solidity
function transfer(address to, uint256 amount) public returns (bool)
function approve(address spender, uint256 amount) public returns (bool)
function transferFrom(address from, address to, uint256 amount) public returns (bool)
```

### 관리자 전용 함수
```solidity
function mint(address to, uint256 amount) public onlyOwner returns (bool)
function burn(uint256 amount) public returns (bool)
function pause() public onlyOwner
function unpause() public onlyOwner
```

### 에어드랍 함수
```solidity
function airdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner
function airdropEqual(address[] memory recipients, uint256 amount) public onlyOwner
```

## 🚀 향후 계획

- [ ] 테스트넷 배포 (Sepolia, Goerli)
- [ ] 프론트엔드 웹 인터페이스 구축
- [ ] MetaMask 연동
- [ ] 스테이킹 기능 추가
- [ ] 거버넌스 토큰 기능
- [ ] 크로스체인 브리지 지원

## 📚 학습 자료

프로젝트에 포함된 `blockchain-study-guide.md` 파일에서 다음 내용을 학습할 수 있습니다:

1. 블록체인 기본 개념
2. 솔리디티 언어 문법
3. 스마트 컨트랙트 개발
4. 테스트 작성 방법
5. 배포 및 운영

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 📞 문의

프로젝트 관련 문의사항이나 개선 제안이 있으시면 Issue를 생성해주세요.

---

**🎉 MyCoin과 함께 블록체인 개발의 세계를 탐험해보세요!**