const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld Contract", function () {
  let helloWorld;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // 계정들 가져오기
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // 컨트랙트 배포
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    helloWorld = await HelloWorld.deploy();
    await helloWorld.waitForDeployment();
  });

  describe("배포", function () {
    it("올바른 초기 메시지를 가져야 함", async function () {
      expect(await helloWorld.getMessage()).to.equal("Hello, Blockchain World!");
    });

    it("배포자가 owner여야 함", async function () {
      expect(await helloWorld.owner()).to.equal(owner.address);
    });

    it("초기 카운터가 0이어야 함", async function () {
      expect(await helloWorld.getCounter()).to.equal(0);
    });
  });

  describe("메시지 변경", function () {
    it("owner는 메시지를 변경할 수 있어야 함", async function () {
      const newMessage = "Hello, VSCode!";
      await helloWorld.setMessage(newMessage);
      expect(await helloWorld.getMessage()).to.equal(newMessage);
    });

    it("owner가 아닌 사용자는 메시지를 변경할 수 없어야 함", async function () {
      await expect(
        helloWorld.connect(addr1).setMessage("Unauthorized change")
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("메시지 변경 시 이벤트가 발생해야 함", async function () {
      const newMessage = "Hello, Events!";
      await expect(helloWorld.setMessage(newMessage))
        .to.emit(helloWorld, "MessageChanged")
        .withArgs("Hello, Blockchain World!", newMessage, owner.address);
    });
  });

  describe("카운터", function () {
    it("누구나 카운터를 증가시킬 수 있어야 함", async function () {
      await helloWorld.connect(addr1).incrementCounter();
      expect(await helloWorld.getCounter()).to.equal(1);
      
      await helloWorld.connect(addr2).incrementCounter();
      expect(await helloWorld.getCounter()).to.equal(2);
    });

    it("카운터 증가 시 이벤트가 발생해야 함", async function () {
      await expect(helloWorld.connect(addr1).incrementCounter())
        .to.emit(helloWorld, "CounterIncremented")
        .withArgs(1, addr1.address);
    });
  });

  describe("컨트랙트 정보", function () {
    it("모든 정보를 올바르게 반환해야 함", async function () {
      // 카운터를 먼저 증가
      await helloWorld.incrementCounter();
      
      const info = await helloWorld.getContractInfo();
      expect(info.currentMessage).to.equal("Hello, Blockchain World!");
      expect(info.contractOwner).to.equal(owner.address);
      expect(info.currentCounter).to.equal(1);
      expect(info.caller).to.equal(owner.address);
    });
  });
});