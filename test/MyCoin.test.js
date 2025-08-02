const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyCoin Token Contract", function () {
  let myCoin;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  const INITIAL_SUPPLY = 1000000; // 1백만 토큰
  const TOKEN_DECIMALS = 18;

  beforeEach(async function () {
    // 계정들 가져오기
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    
    // 컨트랙트 배포
    const MyCoin = await ethers.getContractFactory("MyCoin");
    myCoin = await MyCoin.deploy(INITIAL_SUPPLY);
    await myCoin.waitForDeployment();
  });

  describe("배포", function () {
    it("올바른 토큰 정보를 가져야 함", async function () {
      expect(await myCoin.name()).to.equal("My Coin");
      expect(await myCoin.symbol()).to.equal("MYC");
      expect(await myCoin.decimals()).to.equal(TOKEN_DECIMALS);
    });

    it("초기 공급량이 올바르게 설정되어야 함", async function () {
      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), TOKEN_DECIMALS);
      expect(await myCoin.totalSupply()).to.equal(expectedSupply);
    });

    it("owner가 모든 초기 토큰을 가져야 함", async function () {
      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), TOKEN_DECIMALS);
      expect(await myCoin.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("배포자가 owner여야 함", async function () {
      expect(await myCoin.owner()).to.equal(owner.address);
    });

    it("초기에는 paused 상태가 아니어야 함", async function () {
      expect(await myCoin.paused()).to.equal(false);
    });
  });

  describe("ERC-20 기본 기능", function () {
    const transferAmount = ethers.parseUnits("100", TOKEN_DECIMALS);

    it("토큰을 전송할 수 있어야 함", async function () {
      await myCoin.transfer(addr1.address, transferAmount);
      
      expect(await myCoin.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("잔고가 부족하면 전송이 실패해야 함", async function () {
      const largeAmount = ethers.parseUnits("2000000", TOKEN_DECIMALS);
      
      await expect(
        myCoin.transfer(addr1.address, largeAmount)
      ).to.be.revertedWith("MyCoin: insufficient balance");
    });

    it("영주소로 전송할 수 없어야 함", async function () {
      await expect(
        myCoin.transfer(ethers.ZeroAddress, transferAmount)
      ).to.be.revertedWith("MyCoin: address cannot be zero");
    });

    it("토큰 전송 시 이벤트가 발생해야 함", async function () {
      await expect(myCoin.transfer(addr1.address, transferAmount))
        .to.emit(myCoin, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });
  });

  describe("승인 및 위임 전송", function () {
    const approveAmount = ethers.parseUnits("50", TOKEN_DECIMALS);
    const transferAmount = ethers.parseUnits("30", TOKEN_DECIMALS);

    it("토큰 전송을 승인할 수 있어야 함", async function () {
      await myCoin.approve(addr1.address, approveAmount);
      
      expect(await myCoin.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("승인된 양만큼 대신 전송할 수 있어야 함", async function () {
      await myCoin.approve(addr1.address, approveAmount);
      await myCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      expect(await myCoin.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await myCoin.allowance(owner.address, addr1.address)).to.equal(approveAmount - transferAmount);
    });

    it("승인된 양보다 많이 전송하면 실패해야 함", async function () {
      await myCoin.approve(addr1.address, approveAmount);
      
      await expect(
        myCoin.connect(addr1).transferFrom(owner.address, addr2.address, approveAmount + ethers.parseUnits("1", TOKEN_DECIMALS))
      ).to.be.revertedWith("MyCoin: insufficient allowance");
    });

    it("승인 시 이벤트가 발생해야 함", async function () {
      await expect(myCoin.approve(addr1.address, approveAmount))
        .to.emit(myCoin, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });
  });

  describe("토큰 발행", function () {
    const mintAmount = ethers.parseUnits("1000", TOKEN_DECIMALS);

    it("owner는 토큰을 발행할 수 있어야 함", async function () {
      const initialSupply = await myCoin.totalSupply();
      
      await myCoin.mint(addr1.address, mintAmount);
      
      expect(await myCoin.totalSupply()).to.equal(initialSupply + mintAmount);
      expect(await myCoin.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("owner가 아닌 사용자는 토큰을 발행할 수 없어야 함", async function () {
      await expect(
        myCoin.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWith("MyCoin: caller is not the owner");
    });

    it("토큰 발행 시 이벤트가 발생해야 함", async function () {
      await expect(myCoin.mint(addr1.address, mintAmount))
        .to.emit(myCoin, "Mint")
        .withArgs(addr1.address, mintAmount)
        .and.to.emit(myCoin, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });
  });

  describe("토큰 소각", function () {
    const burnAmount = ethers.parseUnits("100", TOKEN_DECIMALS);

    beforeEach(async function () {
      // addr1에게 토큰 전송
      await myCoin.transfer(addr1.address, ethers.parseUnits("500", TOKEN_DECIMALS));
    });

    it("토큰을 소각할 수 있어야 함", async function () {
      const initialBalance = await myCoin.balanceOf(addr1.address);
      const initialSupply = await myCoin.totalSupply();
      
      await myCoin.connect(addr1).burn(burnAmount);
      
      expect(await myCoin.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
      expect(await myCoin.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("잔고보다 많은 토큰을 소각하면 실패해야 함", async function () {
      const largeAmount = ethers.parseUnits("1000", TOKEN_DECIMALS);
      
      await expect(
        myCoin.connect(addr1).burn(largeAmount)
      ).to.be.revertedWith("MyCoin: insufficient balance to burn");
    });

    it("owner는 다른 주소의 토큰을 소각할 수 있어야 함", async function () {
      const initialBalance = await myCoin.balanceOf(addr1.address);
      const initialSupply = await myCoin.totalSupply();
      
      await myCoin.burnFrom(addr1.address, burnAmount);
      
      expect(await myCoin.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
      expect(await myCoin.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("토큰 소각 시 이벤트가 발생해야 함", async function () {
      await expect(myCoin.connect(addr1).burn(burnAmount))
        .to.emit(myCoin, "Burn")
        .withArgs(addr1.address, burnAmount)
        .and.to.emit(myCoin, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);
    });
  });

  describe("일시 정지 기능", function () {
    const transferAmount = ethers.parseUnits("100", TOKEN_DECIMALS);

    it("owner는 토큰을 일시 정지할 수 있어야 함", async function () {
      await myCoin.pause();
      expect(await myCoin.paused()).to.equal(true);
    });

    it("일시 정지 상태에서는 전송이 불가능해야 함", async function () {
      await myCoin.pause();
      
      await expect(
        myCoin.transfer(addr1.address, transferAmount)
      ).to.be.revertedWith("MyCoin: token transfer while paused");
    });

    it("owner는 일시 정지를 해제할 수 있어야 함", async function () {
      await myCoin.pause();
      await myCoin.unpause();
      
      expect(await myCoin.paused()).to.equal(false);
      
      // 전송이 다시 가능해야 함
      await expect(myCoin.transfer(addr1.address, transferAmount)).to.not.be.reverted;
    });

    it("owner가 아닌 사용자는 일시 정지할 수 없어야 함", async function () {
      await expect(
        myCoin.connect(addr1).pause()
      ).to.be.revertedWith("MyCoin: caller is not the owner");
    });
  });

  describe("에어드랍 기능", function () {
    const airdropAmount = ethers.parseUnits("10", TOKEN_DECIMALS);

    it("동일한 양의 토큰을 여러 주소에 에어드랍할 수 있어야 함", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address];
      
      await myCoin.airdropEqual(recipients, airdropAmount);
      
      for (const recipient of recipients) {
        expect(await myCoin.balanceOf(recipient)).to.equal(airdropAmount);
      }
    });

    it("서로 다른 양의 토큰을 여러 주소에 에어드랍할 수 있어야 함", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address];
      const amounts = [
        ethers.parseUnits("10", TOKEN_DECIMALS),
        ethers.parseUnits("20", TOKEN_DECIMALS),
        ethers.parseUnits("30", TOKEN_DECIMALS)
      ];
      
      await myCoin.airdrop(recipients, amounts);
      
      for (let i = 0; i < recipients.length; i++) {
        expect(await myCoin.balanceOf(recipients[i])).to.equal(amounts[i]);
      }
    });

    it("배열 길이가 다르면 에어드랍이 실패해야 함", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseUnits("10", TOKEN_DECIMALS)];
      
      await expect(
        myCoin.airdrop(recipients, amounts)
      ).to.be.revertedWith("MyCoin: arrays length mismatch");
    });
  });

  describe("조회 함수들", function () {
    it("토큰 정보를 올바르게 반환해야 함", async function () {
      const tokenInfo = await myCoin.getTokenInfo();
      
      expect(tokenInfo.tokenName).to.equal("My Coin");
      expect(tokenInfo.tokenSymbol).to.equal("MYC");
      expect(tokenInfo.tokenDecimals).to.equal(TOKEN_DECIMALS);
      expect(tokenInfo.tokenOwner).to.equal(owner.address);
      expect(tokenInfo.isPaused).to.equal(false);
    });

    it("사용자 정보를 올바르게 반환해야 함", async function () {
      const transferAmount = ethers.parseUnits("100", TOKEN_DECIMALS);
      const approveAmount = ethers.parseUnits("50", TOKEN_DECIMALS);
      
      await myCoin.transfer(addr1.address, transferAmount);
      await myCoin.connect(addr1).approve(owner.address, approveAmount);
      
      const userInfo = await myCoin.getUserInfo(addr1.address, owner.address);
      
      expect(userInfo.balance).to.equal(transferAmount);
      expect(userInfo.allowanceToSpender).to.equal(approveAmount);
    });

    it("단위 변환 함수가 올바르게 작동해야 함", async function () {
      const etherAmount = 100;
      const weiAmount = ethers.parseUnits(etherAmount.toString(), TOKEN_DECIMALS);
      
      expect(await myCoin.toWei(etherAmount)).to.equal(weiAmount);
      expect(await myCoin.toEther(weiAmount)).to.equal(etherAmount);
    });
  });

  describe("소유권 이전", function () {
    it("owner는 소유권을 이전할 수 있어야 함", async function () {
      await myCoin.transferOwnership(addr1.address);
      
      expect(await myCoin.owner()).to.equal(addr1.address);
    });

    it("새로운 owner는 관리자 기능을 사용할 수 있어야 함", async function () {
      await myCoin.transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseUnits("100", TOKEN_DECIMALS);
      await expect(myCoin.connect(addr1).mint(addr2.address, mintAmount)).to.not.be.reverted;
    });

    it("이전 owner는 관리자 기능을 사용할 수 없어야 함", async function () {
      await myCoin.transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseUnits("100", TOKEN_DECIMALS);
      await expect(
        myCoin.mint(addr2.address, mintAmount)
      ).to.be.revertedWith("MyCoin: caller is not the owner");
    });

    it("소유권 이전 시 이벤트가 발생해야 함", async function () {
      await expect(myCoin.transferOwnership(addr1.address))
        .to.emit(myCoin, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);
    });
  });
});