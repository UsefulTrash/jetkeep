// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// JetKeep — USDC custody / inheritance lock
contract JetKeep {
    address public owner;
    struct Lock {
        address depositor; address beneficiary;
        uint256 amount; uint256 releaseAt;
        string  note; bool released;
    }
    Lock[] public locks;
    event LockCreated(uint256 indexed id, address beneficiary, uint256 amount, uint256 releaseAt);
    event Released(uint256 indexed id, address beneficiary, uint256 amount);
    constructor() { owner = msg.sender; }
    function createLock(address beneficiary, uint256 releaseAt, string calldata note) external payable returns (uint256) {
        require(msg.value > 0, "Zero USDC");
        require(releaseAt > block.timestamp, "Release in past");
        locks.push(Lock(msg.sender, beneficiary, msg.value, releaseAt, note, false));
        emit LockCreated(locks.length - 1, beneficiary, msg.value, releaseAt);
        return locks.length - 1;
    }
    function release(uint256 lockId) external {
        Lock storage l = locks[lockId];
        require(!l.released, "Already released");
        require(block.timestamp >= l.releaseAt, "Too early");
        require(msg.sender == l.beneficiary || msg.sender == l.depositor, "Unauthorized");
        l.released = true;
        payable(l.beneficiary).transfer(l.amount);
        emit Released(lockId, l.beneficiary, l.amount);
    }
    function lockCount() external view returns (uint256) { return locks.length; }
}