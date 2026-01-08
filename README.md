# Rumble Development Environment Startup Scripts

A cross-platform Node.js script to start all Rumble workers in the development environment with automatic RPC key capture and management.

## Overview

This repository contains the startup script and worker configuration for the Rumble development environment. The script automatically:
- Captures RPC keys from processor workers
- Starts API workers with the correct RPC keys
- Opens each worker in a separate terminal window
- Manages the startup sequence to ensure proper dependencies

## Directory Structure

The script expects the following structure:

```
rumble-startup/          # This directory (script location)
├── start-rumble-dev.js  # Main startup script
├── workers.config.js   # Worker configurations
└── README.md           # This file

../                      # One level up (dev root - required)
├── indexers/           # Indexer workers
│   ├── wdk-indexer-wrk-evm/
│   ├── wdk-indexer-wrk-btc/
│   ├── wdk-indexer-wrk-ton/
│   ├── wdk-indexer-wrk-solana/
│   ├── wdk-indexer-wrk-tron/
│   └── wdk-indexer-wrk-spark/
├── rumble-app-node/    # Rumble HTTP API
├── rumble-data-shard-wrk/
├── rumble-ork-wrk/
```

**Required directories:**
- `../indexers/` - Contains all indexer worker repositories
- `../rumble-app-node/` - Rumble HTTP API worker
- `../rumble-data-shard-wrk/` - Rumble data shard worker
- `../rumble-ork-wrk/` - Rumble ORK worker

**Optional directories:**
- `../wdk-*/` - WDK worker repositories (not started by default)

## Prerequisites

- Node.js >= 16
- All worker repositories cloned and dependencies installed (`npm install` in each)
- Redis running on port 6379 (required for HTTP workers)
- Configuration files set up in each worker's `config/` directory

## Environment Options

The script supports three environment modes via the `--env` flag:

- **`development`** (default) - For local development
- **`staging`** - For staging/testing environments  
- **`production`** - For production deployments

The environment is passed to all workers via the `--env` flag in their worker commands.

## Usage

### Basic Usage

```bash
# Start all indexers (default: development environment)
node start-rumble-dev.js --all

# Start specific indexers
node start-rumble-dev.js --eth
node start-rumble-dev.js --eth --usdt-eth --btc
node start-rumble-dev.js --ton --usdt-ton

# Specify environment (development, staging, production)
node start-rumble-dev.js --all --env production
node start-rumble-dev.js --eth --env staging
node start-rumble-dev.js --all --env=production

# Show help
node start-rumble-dev.js --help
```

### Available Indexers

The script supports the following indexers:

**EVM Chains:**
- `--eth` - Ethereum (ETH)
- `--usdt-eth` - USDT on Ethereum
- `--xaut-eth` - XAUT on Ethereum
- `--usdt-arb` - USDT on Arbitrum
- `--usdt-pol` - USDT on Polygon
- `--usdt-plasma` - USDT on Plasma
- `--xaut-plasma` - XAUT on Plasma
- `--sepolia` - Sepolia testnet (Ethereum)
- `--usdt-sepolia` - USDT on Sepolia testnet
- `--erc20` - ERC20 template (for custom tokens)

**Bitcoin:**
- `--btc` - Bitcoin (BTC)

**TON Chain:**
- `--ton` - TON native
- `--usdt-ton` - USDT on TON
- `--xaut-ton` - XAUT on TON
- `--jetton` - Jetton template (for custom tokens)

**Solana:**
- `--solana` - Solana native
- `--usdt-sol` - USDT on Solana
- `--spl` - SPL template (for custom tokens)

**Tron:**
- `--tron` - Tron native
- `--usdt-tron` - USDT on Tron

**Spark:**
- `--spark` - Spark chain

### Examples

```bash
# Start all indexers (development environment)
node start-rumble-dev.js --all

# Start only Ethereum indexers
node start-rumble-dev.js --eth --usdt-eth --xaut-eth

# Start Bitcoin and TON indexers
node start-rumble-dev.js --btc --ton --usdt-ton

# Start EVM indexers across multiple chains
node start-rumble-dev.js --eth --usdt-eth --usdt-arb --usdt-pol

# Start Plasma indexers
node start-rumble-dev.js --usdt-plasma --xaut-plasma

# Start with staging environment
node start-rumble-dev.js --all --env staging

# Start with production environment
node start-rumble-dev.js --eth --usdt-eth --env production

# Start specific combination with environment
node start-rumble-dev.js --eth --btc --solana --ton --env=production
```

## How It Works

1. **Phase 1: Indexer Workers**
   - Starts all selected indexer processor workers
   - Captures RPC public keys from each processor
   - Immediately starts corresponding API workers with captured keys
   - Each worker opens in its own terminal window

2. **Phase 2: Core Workers**
   - Starts Data Shard Processor and captures its RPC key
   - Starts Data Shard API with the captured key
   - Starts ORK API Worker
   - Starts HTTP Node Worker (port 3000)

## Worker Configuration

Worker configurations are defined in `workers.config.js`. Each worker includes:
- Directory path (relative to dev root)
- Worker type (`wtype`)
- Rack identifier
- Chain name (must match config filename)
- Description

### Important: Chain Names Must Match Config Files

The chain name in `workers.config.js` must exactly match the config filename:
- `chain: 'eth'` → loads `eth.json`
- `chain: 'bitcoin'` → loads `bitcoin.json`
- `chain: 'usdt-eth'` → loads `usdt-eth.json`

## Core Workers

Core workers always start regardless of indexer selection:

- **Data Shard Processor** - Processes data shard operations
- **Data Shard API** - Provides API access to data shard operations
- **ORK API Worker** - Manages ordering and replication keys
- **HTTP Node Worker** - Provides HTTP API endpoints (port 3000)

## WDK Workers

WDK workers are available but not started by default. They can be added to the startup sequence if needed:

- **WDK Data Shard Processor/API** - WDK data shard operations
- **WDK HTTP Node Worker** - WDK HTTP API (port 3001)
- **WDK Indexer App Node** - Indexer management API (port 3002)

## Platform Support

The script works on:
- **Windows** - Uses `cmd /k` to open new command windows
- **macOS** - Uses `osascript` to open Terminal.app windows
  - Requires Terminal.app to be available
  - Properly escapes paths and commands with special characters
- **Linux** - Automatically detects and uses available terminal:
  - `gnome-terminal` (GNOME desktop)
  - `xterm` (X11)
  - `konsole` (KDE desktop)
  - `alacritty` (cross-platform)
  - `terminator` (GTK)
  - Falls back to next option if one is not available
  - Properly escapes paths and commands with special characters

## Troubleshooting

### RPC Key Capture Fails

If RPC key capture fails for a worker:
- The processor will still start
- The API worker will be skipped
- Check the processor terminal for errors
- You may need to manually start the API worker with the RPC key

### Config File Not Found

If you see `ENOENT: no such file or directory` errors:
- Ensure the chain name in `workers.config.js` matches the config filename
- Run `setup-config.sh` in the worker directory to generate config files
- Check that config files exist in the worker's `config/` directory

### Redis Connection Errors

If HTTP workers fail to start:
- Ensure Redis is running on port 6379
- Check Redis connection settings in worker configs

### Initial Topic Lookup Errors

`ERR_TOPIC_LOOKUP_EMPTY` errors are normal during startup:
- Indexers need time to initialize their topics
- Errors should resolve once all indexers finish starting
- If errors persist, check that indexers started successfully

## Configuration

### Worker Paths

Paths are automatically resolved relative to the script location:
- Script directory: `rumble-startup/`
- Dev root: One level up (`../`)
- Indexers: `../indexers/`
- Workers: `../` (one level up)

### Adding New Workers

To add a new worker:

1. Add configuration to `workers.config.js`:
```javascript
newWorker: {
  name: 'New Worker',
  proc: {
    dir: path.join(DEV_ROOT, 'indexers', 'new-indexer'),
    wtype: 'wrk-new-indexer-proc',
    rack: 'w-X',
    chain: 'new-chain',  // Must match config filename
    description: 'Description'
  },
  api: {
    // API worker config
  }
}
```

2. Update argument parsing in `start-rumble-dev.js` if needed
3. Ensure config file exists: `{chain}.json` in the worker's `config/` directory

## License

MIT License - see LICENSE file for details.