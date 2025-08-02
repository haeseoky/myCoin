const { ethers } = require("hardhat");

async function main() {
  console.log("🪙 MyCoin 토큰 배포 시작...");
  console.log("=" * 50);
  
  // 배포할 계정 정보
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("📝 배포 계정:", deployer.address);
  
  // 계정 잔고 확인
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 계정 잔고:", ethers.formatEther(balance), "ETH");
  
  // 배포 파라미터
  const INITIAL_SUPPLY = 1000000; // 1백만 토큰
  
  console.log("📋 배포 파라미터:");
  console.log(`   - 토큰명: My Coin`);
  console.log(`   - 심볼: MYC`);
  console.log(`   - 소수점: 18`);
  console.log(`   - 초기 발행량: ${INITIAL_SUPPLY.toLocaleString()} MYC`);
  
  // 컨트랙트 팩토리 가져오기
  const MyCoin = await ethers.getContractFactory("MyCoin");
  
  // 컨트랙트 배포
  console.log("\n⏳ 배포 중...");
  const myCoin = await MyCoin.deploy(INITIAL_SUPPLY);
  await myCoin.waitForDeployment();
  
  const contractAddress = await myCoin.getAddress();
  console.log("✅ MyCoin 토큰 배포 완료!");
  console.log("📍 컨트랙트 주소:", contractAddress);
  
  // 초기 상태 확인
  console.log("\n📊 배포된 토큰 정보:");
  const tokenInfo = await myCoin.getTokenInfo();
  console.log(`   - 이름: ${tokenInfo.tokenName}`);
  console.log(`   - 심볼: ${tokenInfo.tokenSymbol}`);
  console.log(`   - 소수점: ${tokenInfo.tokenDecimals}`);
  console.log(`   - 총 발행량: ${ethers.formatUnits(tokenInfo.tokenTotalSupply, 18)} MYC`);
  console.log(`   - 소유자: ${tokenInfo.tokenOwner}`);
  console.log(`   - 일시정지: ${tokenInfo.isPaused}`);
  
  // 배포자 잔고 확인
  const deployerBalance = await myCoin.balanceOf(deployer.address);
  console.log(`   - 배포자 잔고: ${ethers.formatUnits(deployerBalance, 18)} MYC`);
  
  // 토큰 기능 테스트
  console.log("\n🔄 토큰 기능 테스트:");
  
  // 1. 토큰 전송 테스트
  console.log("1️⃣ 토큰 전송 테스트...");
  const transferAmount = ethers.parseUnits("1000", 18); // 1000 MYC
  const tx1 = await myCoin.transfer(addr1.address, transferAmount);
  await tx1.wait();
  
  const addr1Balance = await myCoin.balanceOf(addr1.address);
  console.log(`   ✅ ${deployer.address.slice(0,6)}...${deployer.address.slice(-4)} → ${addr1.address.slice(0,6)}...${addr1.address.slice(-4)}`);
  console.log(`   📦 전송량: ${ethers.formatUnits(transferAmount, 18)} MYC`);
  console.log(`   💰 받는이 잔고: ${ethers.formatUnits(addr1Balance, 18)} MYC`);
  
  // 2. 토큰 승인 및 위임 전송 테스트
  console.log("\n2️⃣ 승인 및 위임 전송 테스트...");
  const approveAmount = ethers.parseUnits("500", 18); // 500 MYC
  const tx2 = await myCoin.connect(addr1).approve(addr2.address, approveAmount);
  await tx2.wait();
  
  const allowance = await myCoin.allowance(addr1.address, addr2.address);
  console.log(`   ✅ ${addr1.address.slice(0,6)}...${addr1.address.slice(-4)} → ${addr2.address.slice(0,6)}...${addr2.address.slice(-4)} 승인`);
  console.log(`   📝 승인량: ${ethers.formatUnits(allowance, 18)} MYC`);
  
  // 위임 전송 실행
  const delegateTransferAmount = ethers.parseUnits("200", 18); // 200 MYC
  const tx3 = await myCoin.connect(addr2).transferFrom(addr1.address, addr2.address, delegateTransferAmount);
  await tx3.wait();
  
  const addr2Balance = await myCoin.balanceOf(addr2.address);
  const remainingAllowance = await myCoin.allowance(addr1.address, addr2.address);
  console.log(`   🔄 위임 전송: ${ethers.formatUnits(delegateTransferAmount, 18)} MYC`);
  console.log(`   💰 받는이 잔고: ${ethers.formatUnits(addr2Balance, 18)} MYC`);
  console.log(`   📝 남은 승인량: ${ethers.formatUnits(remainingAllowance, 18)} MYC`);
  
  // 3. 토큰 발행 테스트
  console.log("\n3️⃣ 토큰 발행 테스트...");
  const mintAmount = ethers.parseUnits("10000", 18); // 10,000 MYC
  const tx4 = await myCoin.mint(deployer.address, mintAmount);
  await tx4.wait();
  
  const newTotalSupply = await myCoin.totalSupply();
  const newDeployerBalance = await myCoin.balanceOf(deployer.address);
  console.log(`   ✅ 신규 발행: ${ethers.formatUnits(mintAmount, 18)} MYC`);
  console.log(`   📊 총 발행량: ${ethers.formatUnits(newTotalSupply, 18)} MYC`);
  console.log(`   💰 배포자 잔고: ${ethers.formatUnits(newDeployerBalance, 18)} MYC`);
  
  // 4. 에어드랍 테스트
  console.log("\n4️⃣ 에어드랍 테스트...");
  const recipients = [addr1.address, addr2.address];
  const airdropAmount = ethers.parseUnits("100", 18); // 각각 100 MYC
  const tx5 = await myCoin.airdropEqual(recipients, airdropAmount);
  await tx5.wait();
  
  console.log(`   ✅ 에어드랍 완료: 각각 ${ethers.formatUnits(airdropAmount, 18)} MYC`);
  for (let i = 0; i < recipients.length; i++) {
    const recipientBalance = await myCoin.balanceOf(recipients[i]);
    console.log(`   💰 ${recipients[i].slice(0,6)}...${recipients[i].slice(-4)}: ${ethers.formatUnits(recipientBalance, 18)} MYC`);
  }
  
  // 최종 상태 요약
  console.log("\n📈 최종 토큰 상태:");
  const finalTotalSupply = await myCoin.totalSupply();
  const finalDeployerBalance = await myCoin.balanceOf(deployer.address);
  const finalAddr1Balance = await myCoin.balanceOf(addr1.address);
  const finalAddr2Balance = await myCoin.balanceOf(addr2.address);
  
  console.log(`   🏦 총 발행량: ${ethers.formatUnits(finalTotalSupply, 18)} MYC`);
  console.log(`   👤 배포자: ${ethers.formatUnits(finalDeployerBalance, 18)} MYC`);
  console.log(`   👤 사용자1: ${ethers.formatUnits(finalAddr1Balance, 18)} MYC`);
  console.log(`   👤 사용자2: ${ethers.formatUnits(finalAddr2Balance, 18)} MYC`);
  
  console.log("\n" + "=" * 50);
  console.log("🎉 MyCoin 토큰 배포 및 테스트 완료!");
  console.log("📋 컨트랙트 정보:");
  console.log("-----------------------------------");
  console.log(`Contract Name: MyCoin (MYC)`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Total Supply: ${ethers.formatUnits(finalTotalSupply, 18)} MYC`);
  console.log(`Owner: ${deployer.address}`);
  console.log(`Network: Hardhat`);
  console.log("-----------------------------------");
  
  // 추가 사용법 안내
  console.log("\n💡 추가 사용법:");
  console.log("   - MetaMask에 토큰 추가: 컨트랙트 주소를 이용해 커스텀 토큰 추가");
  console.log("   - 토큰 전송: transfer() 함수 사용");
  console.log("   - 토큰 승인: approve() 함수 사용");
  console.log("   - 추가 발행: mint() 함수 사용 (owner만 가능)");
  console.log("   - 에어드랍: airdrop() 또는 airdropEqual() 함수 사용");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });