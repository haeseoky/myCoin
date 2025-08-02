# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational blockchain project implementing an ERC-20 token called "MyCoin" using Solidity and Hardhat. The project serves as a comprehensive learning resource for blockchain development, featuring smart contracts, tests, deployment scripts, and detailed documentation.

## Essential Commands

### Core Development Workflow
```bash
npm run compile     # Compile Solidity contracts
npm run test        # Run all tests (34 test cases)
npm run clean       # Clean artifacts and cache
```

### Deployment Commands
```bash
npm run node        # Start local Hardhat blockchain node
npm run deploy      # Deploy to local Hardhat network
npm run deploy:local # Deploy to localhost network (requires running node)
```

### Testing Specific Components
```bash
npx hardhat test test/MyCoin.test.js --grep "배포"        # Run deployment tests only
npx hardhat test test/MyCoin.test.js --grep "토큰 발행"   # Run minting tests only
npx hardhat test test/HelloWorld.test.js               # Run HelloWorld tests only
```

### Advanced Operations
```bash
npx hardhat run scripts/deployMyCoin.js --network localhost    # Deploy with comprehensive testing
npx hardhat console --network localhost                        # Interactive console
npx hardhat compile --force                                   # Force recompilation
```

## Architecture Overview

### Contract Hierarchy
- **HelloWorld.sol**: Educational contract demonstrating basic Solidity concepts (state variables, modifiers, events)
- **MyCoin.sol**: Production-grade ERC-20 implementation with advanced features

### MyCoin Contract Architecture
The main contract follows a modular design pattern:

1. **Core ERC-20 Implementation**: Standard transfer, approve, transferFrom functions
2. **Administrative Layer**: Owner-only functions (mint, burn, pause, ownership transfer)
3. **Security Layer**: Modifiers for access control, pause functionality, and address validation
4. **Extended Features**: Airdrop functionality, batch operations, utility functions

Key design patterns:
- **Pausable Pattern**: Emergency stop mechanism for all transfers
- **Ownable Pattern**: Centralized administrative control
- **Validation Pattern**: Input validation through modifiers

### Test Structure
- **34 comprehensive test cases** covering all functionality
- **Categorized testing**: Deployment, ERC-20 basics, advanced features, security scenarios
- **Event testing**: Verification of emitted events for all operations

### Deployment Architecture
- **Basic deployment** (`deploy.js`): Simple contract deployment
- **Comprehensive deployment** (`deployMyCoin.js`): Deployment + functional testing with real transactions

## Smart Contract Configuration

### Solidity Setup
- **Version**: 0.8.19 (specified in hardhat.config.js)
- **Optimizer**: Enabled with 200 runs for gas efficiency
- **Chain ID**: 1337 for local development

### Token Parameters
- **Name**: "My Coin" 
- **Symbol**: "MYC"
- **Decimals**: 18
- **Initial Supply**: Configurable via constructor (default: 1,000,000 tokens)

## Testing Guidelines

The test suite is comprehensive and should remain at 100% pass rate. Key testing patterns:

### Test Categories
1. **Deployment Tests**: Verify initial state and ownership
2. **ERC-20 Standard Tests**: Basic transfer functionality and edge cases
3. **Administrative Tests**: Owner-only functions and access control
4. **Security Tests**: Pause functionality, invalid inputs, overflow protection
5. **Extended Feature Tests**: Airdrop, batch operations, utility functions

### Critical Test Scenarios
- **Access Control**: All owner-only functions properly restricted
- **Edge Cases**: Zero amounts, invalid addresses, insufficient balances
- **Event Emission**: All state changes emit appropriate events
- **Pause Functionality**: Transfers blocked when paused, admin functions still work

## Key Implementation Notes

### Security Considerations
- Uses explicit access control modifiers (`onlyOwner`, `whenNotPaused`, `validAddress`)
- Implements checks-effects-interactions pattern
- Protects against zero address transfers
- Includes emergency pause mechanism

### Gas Optimization
- Solidity optimizer enabled for production deployment
- Efficient storage patterns with packed structs where applicable
- Minimal external calls and loops

### Educational Features
The codebase is designed for learning with:
- Extensive Korean comments explaining concepts
- Progressive complexity from HelloWorld to MyCoin
- Comprehensive documentation and study guides
- Real-world deployment scenarios with testing

## Development Environment Notes

### Network Configuration
- **Local Hardhat Network**: Default for development and testing
- **Localhost Network**: For testing with persistent local node
- **Port**: 8545 for localhost connections

### File Structure
- `contracts/`: Solidity smart contracts
- `test/`: Comprehensive test suites
- `scripts/`: Deployment and utility scripts
- `artifacts/`: Compiled contract artifacts (auto-generated)
- `cache/`: Hardhat cache (auto-generated)

When working with this codebase, prioritize maintaining test coverage and following the established patterns for security and educational clarity.