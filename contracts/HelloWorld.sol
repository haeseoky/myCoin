// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HelloWorld
 * @dev 첫 번째 스마트 컨트랙트 - 기본 기능 학습용
 */
contract HelloWorld {
    // 상태 변수
    string public message;
    address public owner;
    uint256 public counter;
    
    // 이벤트 정의
    event MessageChanged(string oldMessage, string newMessage, address changedBy);
    event CounterIncremented(uint256 newValue, address incrementedBy);
    
    // 생성자 - 컨트랙트 배포 시 한 번만 실행
    constructor() {
        message = "Hello, Blockchain World!";
        owner = msg.sender;
        counter = 0;
    }
    
    // modifier - 함수 실행 조건 확인
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev 메시지를 변경하는 함수 (owner만 가능)
     * @param newMessage 새로운 메시지
     */
    function setMessage(string memory newMessage) public onlyOwner {
        string memory oldMessage = message;
        message = newMessage;
        emit MessageChanged(oldMessage, newMessage, msg.sender);
    }
    
    /**
     * @dev 현재 메시지를 반환하는 함수 (view - Gas비 무료)
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    /**
     * @dev 카운터를 1씩 증가시키는 함수 (누구나 호출 가능)
     */
    function incrementCounter() public {
        counter += 1;
        emit CounterIncremented(counter, msg.sender);
    }
    
    /**
     * @dev 현재 카운터 값을 반환하는 함수
     */
    function getCounter() public view returns (uint256) {
        return counter;
    }
    
    /**
     * @dev 컨트랙트 정보를 반환하는 함수
     */
    function getContractInfo() public view returns (
        string memory currentMessage,
        address contractOwner,
        uint256 currentCounter,
        address caller
    ) {
        return (message, owner, counter, msg.sender);
    }
}