const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 HelloWorld 컨트랙트 배포 시작...");
  
  // 배포할 계정 정보
  const [deployer] = await ethers.getSigners();
  console.log("📝 배포 계정:", deployer.address);
  
  // 계정 잔고 확인
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 계정 잔고:", ethers.formatEther(balance), "ETH");
  
  // 컨트랙트 팩토리 가져오기
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  
  // 컨트랙트 배포
  console.log("⏳ 배포 중...");
  const helloWorld = await HelloWorld.deploy();
  await helloWorld.waitForDeployment();
  
  const contractAddress = await helloWorld.getAddress();
  console.log("✅ HelloWorld 컨트랙트 배포 완료!");
  console.log("📍 컨트랙트 주소:", contractAddress);
  
  // 초기 상태 확인
  console.log("\n📊 초기 컨트랙트 상태:");
  console.log("메시지:", await helloWorld.getMessage());
  console.log("Owner:", await helloWorld.owner());
  console.log("카운터:", await helloWorld.getCounter());
  
  // 컨트랙트와 상호작용 예시
  console.log("\n🔄 컨트랙트 상호작용 테스트:");
  
  // 카운터 증가
  console.log("⏳ 카운터 증가 중...");
  const tx1 = await helloWorld.incrementCounter();
  await tx1.wait();
  console.log("✅ 카운터 증가 완료:", await helloWorld.getCounter());
  
  // 메시지 변경
  console.log("⏳ 메시지 변경 중...");
  const tx2 = await helloWorld.setMessage("Hello from VSCode!");
  await tx2.wait();
  console.log("✅ 메시지 변경 완료:", await helloWorld.getMessage());
  
  console.log("\n🎉 배포 및 테스트 완료!");
  console.log("📋 컨트랙트 정보를 저장하세요:");
  console.log("-----------------------------------");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: hardhat`);
  console.log("-----------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });