// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MyCoin - ERC-20 토큰 구현
 * @dev 학습용 토큰 컨트랙트 - ERC-20 표준 준수
 * @author 블록체인 스터디
 */
contract MyCoin {
    // ========== 상태 변수 ==========
    
    // 토큰 기본 정보
    string public name = "My Coin";
    string public symbol = "MYC";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // 소유자 및 관리자
    address public owner;
    bool public paused = false;
    
    // 잔고 및 허용량 저장
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // ========== 이벤트 ==========
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Pause();
    event Unpause();
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // ========== 제어자 (Modifiers) ==========
    
    modifier onlyOwner() {
        require(msg.sender == owner, "MyCoin: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "MyCoin: token transfer while paused");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "MyCoin: address cannot be zero");
        _;
    }
    
    // ========== 생성자 ==========
    
    /**
     * @dev 토큰 컨트랙트 생성자
     * @param _initialSupply 초기 발행량 (decimals 제외)
     */
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply * 10**decimals;
        balanceOf[owner] = totalSupply;
        
        emit Transfer(address(0), owner, totalSupply);
        emit OwnershipTransferred(address(0), owner);
    }
    
    // ========== ERC-20 핵심 함수들 ==========
    
    /**
     * @dev 토큰 전송
     * @param to 받는 사람 주소
     * @param amount 전송할 토큰 양
     */
    function transfer(address to, uint256 amount) 
        public 
        whenNotPaused 
        validAddress(to) 
        returns (bool) 
    {
        require(balanceOf[msg.sender] >= amount, "MyCoin: insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev 토큰 전송 권한 승인
     * @param spender 권한을 받을 주소
     * @param amount 승인할 토큰 양
     */
    function approve(address spender, uint256 amount) 
        public 
        whenNotPaused 
        validAddress(spender) 
        returns (bool) 
    {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev 위임받은 권한으로 토큰 전송
     * @param from 보내는 사람 주소
     * @param to 받는 사람 주소
     * @param amount 전송할 토큰 양
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        whenNotPaused 
        validAddress(from) 
        validAddress(to) 
        returns (bool) 
    {
        require(balanceOf[from] >= amount, "MyCoin: insufficient balance");
        require(allowance[from][msg.sender] >= amount, "MyCoin: insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // ========== 확장 함수들 ==========
    
    /**
     * @dev 토큰 발행 (owner만 가능)
     * @param to 토큰을 받을 주소
     * @param amount 발행할 토큰 양
     */
    function mint(address to, uint256 amount) 
        public 
        onlyOwner 
        whenNotPaused 
        validAddress(to) 
        returns (bool) 
    {
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
        return true;
    }
    
    /**
     * @dev 토큰 소각
     * @param amount 소각할 토큰 양
     */
    function burn(uint256 amount) public whenNotPaused returns (bool) {
        require(balanceOf[msg.sender] >= amount, "MyCoin: insufficient balance to burn");
        
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }
    
    /**
     * @dev 특정 주소의 토큰 강제 소각 (owner만 가능)
     * @param from 소각할 주소
     * @param amount 소각할 토큰 양
     */
    function burnFrom(address from, uint256 amount) 
        public 
        onlyOwner 
        whenNotPaused 
        validAddress(from) 
        returns (bool) 
    {
        require(balanceOf[from] >= amount, "MyCoin: insufficient balance to burn");
        
        balanceOf[from] -= amount;
        totalSupply -= amount;
        
        emit Burn(from, amount);
        emit Transfer(from, address(0), amount);
        return true;
    }
    
    // ========== 관리자 함수들 ==========
    
    /**
     * @dev 토큰 전송 일시 정지
     */
    function pause() public onlyOwner {
        require(!paused, "MyCoin: already paused");
        paused = true;
        emit Pause();
    }
    
    /**
     * @dev 토큰 전송 재개
     */
    function unpause() public onlyOwner {
        require(paused, "MyCoin: not paused");
        paused = false;
        emit Unpause();
    }
    
    /**
     * @dev 소유권 이전
     * @param newOwner 새로운 소유자 주소
     */
    function transferOwnership(address newOwner) public onlyOwner validAddress(newOwner) {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    // ========== 조회 함수들 ==========
    
    /**
     * @dev 토큰 정보 일괄 조회
     */
    function getTokenInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        address tokenOwner,
        bool isPaused
    ) {
        return (name, symbol, decimals, totalSupply, owner, paused);
    }
    
    /**
     * @dev 사용자 정보 조회
     * @param user 조회할 사용자 주소
     * @param spender 허용량을 확인할 주소
     */
    function getUserInfo(address user, address spender) public view returns (
        uint256 balance,
        uint256 allowanceToSpender
    ) {
        return (balanceOf[user], allowance[user][spender]);
    }
    
    /**
     * @dev 토큰을 ether 단위로 변환 (표시용)
     * @param amount wei 단위의 토큰 양
     */
    function toEther(uint256 amount) public view returns (uint256) {
        return amount / 10**decimals;
    }
    
    /**
     * @dev ether 단위를 wei 단위로 변환
     * @param amount ether 단위의 토큰 양
     */
    function toWei(uint256 amount) public view returns (uint256) {
        return amount * 10**decimals;
    }
    
    // ========== 에어드랍 기능 ==========
    
    /**
     * @dev 여러 주소에 토큰 에어드랍
     * @param recipients 받을 주소들
     * @param amounts 각각 받을 토큰 양들
     */
    function airdrop(address[] memory recipients, uint256[] memory amounts) 
        public 
        onlyOwner 
        whenNotPaused 
        returns (bool) 
    {
        require(recipients.length == amounts.length, "MyCoin: arrays length mismatch");
        require(recipients.length <= 200, "MyCoin: too many recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "MyCoin: recipient cannot be zero address");
            require(balanceOf[owner] >= amounts[i], "MyCoin: insufficient balance for airdrop");
            
            balanceOf[owner] -= amounts[i];
            balanceOf[recipients[i]] += amounts[i];
            
            emit Transfer(owner, recipients[i], amounts[i]);
        }
        
        return true;
    }
    
    /**
     * @dev 동일한 양의 토큰을 여러 주소에 에어드랍
     * @param recipients 받을 주소들
     * @param amount 각각 받을 토큰 양
     */
    function airdropEqual(address[] memory recipients, uint256 amount) 
        public 
        onlyOwner 
        whenNotPaused 
        returns (bool) 
    {
        require(recipients.length <= 200, "MyCoin: too many recipients");
        
        uint256 totalAmount = recipients.length * amount;
        require(balanceOf[owner] >= totalAmount, "MyCoin: insufficient balance for airdrop");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "MyCoin: recipient cannot be zero address");
            
            balanceOf[owner] -= amount;
            balanceOf[recipients[i]] += amount;
            
            emit Transfer(owner, recipients[i], amount);
        }
        
        return true;
    }
}