/**
 * Worker configurations for Rumble Development Environment
 * 
 * Path structure:
 * - Script is in: rumble-startup/
 * - Workers are in: ../ (one level up)
 * - Indexers are in: ../indexers/
 */

const path = require('path')

// Get the parent directory (dev root) - one level up from script directory
const DEV_ROOT = path.resolve(__dirname, '..')

module.exports = {
  indexers: {
    // EVM Indexers
    eth: {
      name: 'ETH',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-evm-indexer-proc',
        rack: 'w-0',
        chain: 'eth',
        description: 'EVM Indexer Processor - Processes EVM chain blocks and transactions (ETH)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-evm-indexer-api',
        rack: 'w-0-0',
        chain: 'eth',
        description: 'EVM Indexer API - Serves indexed data for EVM chain (ETH)'
      }
    },
    'usdt-eth': {
      name: 'USDT-ETH',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-1',
        chain: 'usdt-eth',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (USDT on Ethereum)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-1-0',
        chain: 'usdt-eth',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (USDT on Ethereum)'
      }
    },
    'xaut-eth': {
      name: 'XAUT-ETH',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-2',
        chain: 'xaut-eth',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (XAUT on Ethereum)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-2-0',
        chain: 'xaut-eth',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (XAUT on Ethereum)'
      }
    },
    'usdt-arb': {
      name: 'USDT-ARB',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-12',
        chain: 'usdt-arb',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (USDT on Arbitrum)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-12-0',
        chain: 'usdt-arb',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (USDT on Arbitrum)'
      }
    },
    'usdt-pol': {
      name: 'USDT-POL',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-13',
        chain: 'usdt-pol',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (USDT on Polygon)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-13-0',
        chain: 'usdt-pol',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (USDT on Polygon)'
      }
    },
    'usdt-plasma': {
      name: 'USDT-PLASMA',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-14',
        chain: 'usdt-plasma',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (USDT on Plasma)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-14-0',
        chain: 'usdt-plasma',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (USDT on Plasma)'
      }
    },
    'xaut-plasma': {
      name: 'XAUT-PLASMA',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-15',
        chain: 'xaut-plasma',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (XAUT on Plasma)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-15-0',
        chain: 'xaut-plasma',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (XAUT on Plasma)'
      }
    },
    sepolia: {
      name: 'SEPOLIA',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-evm-indexer-proc',
        rack: 'w-16',
        chain: 'sepolia',
        description: 'EVM Indexer Processor - Processes EVM chain blocks and transactions (Sepolia testnet)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-evm-indexer-api',
        rack: 'w-16-0',
        chain: 'sepolia',
        description: 'EVM Indexer API - Serves indexed data for EVM chain (Sepolia testnet)'
      }
    },
    'usdt-sepolia': {
      name: 'USDT-SEPOLIA',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-17',
        chain: 'usdt-sepolia',
        description: 'ERC20 Indexer Processor - Processes ERC20 token transfers (USDT on Sepolia testnet)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-17-0',
        chain: 'usdt-sepolia',
        description: 'ERC20 Indexer API - Serves indexed data for ERC20 tokens (USDT on Sepolia testnet)'
      }
    },
    erc20: {
      name: 'ERC20-TEMPLATE',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-proc',
        rack: 'w-18',
        chain: 'erc20',
        description: 'ERC20 Indexer Processor - Template for custom ERC20 tokens'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-evm'),
        wtype: 'wrk-erc20-indexer-api',
        rack: 'w-18-0',
        chain: 'erc20',
        description: 'ERC20 Indexer API - Template for custom ERC20 tokens'
      }
    },
    // Bitcoin Indexer
    btc: {
      name: 'BTC',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-btc'),
        wtype: 'wrk-btc-indexer-proc',
        rack: 'w-3',
        chain: 'bitcoin',
        description: 'Bitcoin Indexer Processor - Processes Bitcoin blocks and transactions'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-btc'),
        wtype: 'wrk-btc-indexer-api',
        rack: 'w-3-0',
        chain: 'bitcoin',
        description: 'Bitcoin Indexer API - Serves indexed data for Bitcoin'
      }
    },
    // TON Indexers
    ton: {
      name: 'TON',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-ton-indexer-proc',
        rack: 'w-4',
        chain: 'ton',
        description: 'TON Indexer Processor - Processes TON chain blocks and transactions'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-ton-indexer-api',
        rack: 'w-4-0',
        chain: 'ton',
        description: 'TON Indexer API - Serves indexed data for TON chain'
      }
    },
    'usdt-ton': {
      name: 'USDT-TON',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-proc',
        rack: 'w-5',
        chain: 'usdt-ton',
        description: 'Jetton Indexer Processor - Processes Jetton token transfers (USDT on TON)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-api',
        rack: 'w-5-0',
        chain: 'usdt-ton',
        description: 'Jetton Indexer API - Serves indexed data for Jetton tokens (USDT on TON)'
      }
    },
    'xaut-ton': {
      name: 'XAUT-TON',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-proc',
        rack: 'w-6',
        chain: 'xaut-ton',
        description: 'Jetton Indexer Processor - Processes Jetton token transfers (XAUT on TON)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-api',
        rack: 'w-6-0',
        chain: 'xaut-ton',
        description: 'Jetton Indexer API - Serves indexed data for Jetton tokens (XAUT on TON)'
      }
    },
    jetton: {
      name: 'JETTON-TEMPLATE',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-proc',
        rack: 'w-19',
        chain: 'jetton',
        description: 'Jetton Indexer Processor - Template for custom Jetton tokens'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-ton'),
        wtype: 'wrk-jetton-indexer-api',
        rack: 'w-19-0',
        chain: 'jetton',
        description: 'Jetton Indexer API - Template for custom Jetton tokens'
      }
    },
    // Solana Indexers
    solana: {
      name: 'SOLANA',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-solana-indexer-proc',
        rack: 'w-7',
        chain: 'solana',
        description: 'Solana Indexer Processor - Processes Solana blocks and transactions'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-solana-indexer-api',
        rack: 'w-7-0',
        chain: 'solana',
        description: 'Solana Indexer API - Serves indexed data for Solana chain'
      }
    },
    'usdt-sol': {
      name: 'USDT-SOL',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-spl-indexer-proc',
        rack: 'w-8',
        chain: 'usdt-sol',
        description: 'SPL Indexer Processor - Processes SPL token transfers (USDT on Solana)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-spl-indexer-api',
        rack: 'w-8-0',
        chain: 'usdt-sol',
        description: 'SPL Indexer API - Serves indexed data for SPL tokens (USDT on Solana)'
      }
    },
    spl: {
      name: 'SPL-TEMPLATE',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-spl-indexer-proc',
        rack: 'w-20',
        chain: 'spl',
        description: 'SPL Indexer Processor - Template for custom SPL tokens'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-solana'),
        wtype: 'wrk-spl-indexer-api',
        rack: 'w-20-0',
        chain: 'spl',
        description: 'SPL Indexer API - Template for custom SPL tokens'
      }
    },
    // Tron Indexers
    tron: {
      name: 'TRON',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-tron'),
        wtype: 'wrk-tron-indexer-proc',
        rack: 'w-9',
        chain: 'tron',
        description: 'Tron Indexer Processor - Processes Tron blocks and transactions'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-tron'),
        wtype: 'wrk-tron-indexer-api',
        rack: 'w-9-0',
        chain: 'tron',
        description: 'Tron Indexer API - Serves indexed data for Tron chain'
      }
    },
    'usdt-tron': {
      name: 'USDT-TRON',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-tron'),
        wtype: 'wrk-trc20-indexer-proc',
        rack: 'w-10',
        chain: 'usdt-tron',
        description: 'TRC20 Indexer Processor - Processes TRC20 token transfers (USDT on Tron)'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-tron'),
        wtype: 'wrk-trc20-indexer-api',
        rack: 'w-10-0',
        chain: 'usdt-tron',
        description: 'TRC20 Indexer API - Serves indexed data for TRC20 tokens (USDT on Tron)'
      }
    },
    // Spark Indexer
    spark: {
      name: 'SPARK',
      proc: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-spark'),
        wtype: 'wrk-spark-indexer-proc',
        rack: 'w-11',
        chain: 'spark',
        description: 'Spark Indexer Processor - Processes Spark chain blocks and transactions'
      },
      api: {
        dir: path.join(DEV_ROOT, 'indexers', 'wdk-indexer-wrk-spark'),
        wtype: 'wrk-spark-indexer-api',
        rack: 'w-11-0',
        chain: 'spark',
        description: 'Spark Indexer API - Serves indexed data for Spark chain'
      }
    }
  },
  core: {
    // Rumble Core Workers
    dataShardProc: {
      name: 'Data Shard Processor',
      dir: path.join(DEV_ROOT, 'rumble-data-shard-wrk'),
      wtype: 'wrk-data-shard-proc',
      rack: 'shard-0-0',
      description: 'Data Shard Processor - Processes data shard operations'
    },
    dataShardApi: {
      name: 'Data Shard API Worker',
      dir: path.join(DEV_ROOT, 'rumble-data-shard-wrk'),
      wtype: 'wrk-data-shard-api',
      rack: 'shard-0-0',
      description: 'Data Shard API Worker - Provides API access to data shard operations'
    },
    ork: {
      name: 'ORK API Worker',
      dir: path.join(DEV_ROOT, 'rumble-ork-wrk'),
      wtype: 'wrk-ork-api',
      rack: 'ork-0',
      description: 'ORK API Worker - Manages ordering and replication keys'
    },
    http: {
      name: 'HTTP Node Worker',
      dir: path.join(DEV_ROOT, 'rumble-app-node'),
      wtype: 'wrk-node-http',
      port: 3000,
      description: 'HTTP Node Worker - Provides HTTP API endpoints (requires Redis on port 6379)'
    }
  },
  wdk: {
    // WDK Core Workers
    wdkDataShardProc: {
      name: 'WDK Data Shard Processor',
      dir: path.join(DEV_ROOT, 'wdk-data-shard-wrk'),
      wtype: 'wrk-data-shard-proc',
      rack: 'wdk-shard-0-0',
      description: 'WDK Data Shard Processor - Processes WDK data shard operations'
    },
    wdkDataShardApi: {
      name: 'WDK Data Shard API Worker',
      dir: path.join(DEV_ROOT, 'wdk-data-shard-wrk'),
      wtype: 'wrk-data-shard-api',
      rack: 'wdk-shard-0-0',
      description: 'WDK Data Shard API Worker - Provides API access to WDK data shard operations'
    },
    wdkHttp: {
      name: 'WDK HTTP Node Worker',
      dir: path.join(DEV_ROOT, 'wdk-app-node'),
      wtype: 'wrk-node-http',
      port: 3001,
      description: 'WDK HTTP Node Worker - Provides HTTP API endpoints for WDK (requires Redis on port 6379)'
    },
    wdkIndexerApp: {
      name: 'WDK Indexer App Node',
      dir: path.join(DEV_ROOT, 'wdk-indexer-app-node'),
      wtype: 'wrk-node-http',
      port: 3002,
      description: 'WDK Indexer App Node - Provides HTTP API endpoints for indexer management (requires Redis on port 6379)'
    }
  }
}

