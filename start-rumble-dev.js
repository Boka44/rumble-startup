#!/usr/bin/env node
/**
 * Rumble Development Environment Startup Script
 * Cross-platform script to start Rumble workers with automatic RPC key capture
 */

const { spawn, exec } = require('child_process')
const path = require('path')

// Import worker configurations from separate file
const WORKERS = require('./workers.config.js')

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const selected = {
    all: false,
    help: false,
    env: 'development' // Default environment
  }

  // Valid environment options
  const validEnvs = ['development', 'staging', 'production']

  // Initialize all indexer flags
  for (const key in WORKERS.indexers) {
    selected[key] = false
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--all') {
      selected.all = true
    } else if (arg === '--help' || arg === '-h') {
      selected.help = true
    } else if (arg === '--env' && i + 1 < args.length) {
      // Handle --env flag with value
      const envValue = args[i + 1]
      if (validEnvs.includes(envValue)) {
        selected.env = envValue
        i++ // Skip next argument as we've consumed it
      } else {
        console.error(`Error: Invalid environment '${envValue}'. Valid options: ${validEnvs.join(', ')}`)
        process.exit(1)
      }
    } else if (arg.startsWith('--env=')) {
      // Handle --env=value format
      const envValue = arg.split('=')[1]
      if (validEnvs.includes(envValue)) {
        selected.env = envValue
      } else {
        console.error(`Error: Invalid environment '${envValue}'. Valid options: ${validEnvs.join(', ')}`)
        process.exit(1)
      }
    } else if (arg.startsWith('--')) {
      // Support --eth, --usdt-eth, --xaut-eth, --btc, --ton, etc.
      const indexerKey = arg.slice(2)
      if (WORKERS.indexers[indexerKey]) {
        selected[indexerKey] = true
      } else {
        console.warn(`Warning: Unknown indexer option: ${arg}`)
      }
    }
  }

  return selected
}

// Show help message
function showHelp() {
  const indexerList = Object.keys(WORKERS.indexers)
    .map(key => `  --${key.padEnd(12)} Start ${WORKERS.indexers[key].name} indexer (processor + API)`)
    .join('\n')

  console.log(`
Rumble Development Environment Startup Script

Usage: node start-rumble-dev.js [options]

Options:
  --all              Start all indexers
  --env <env>        Set environment (development, staging, production)
                     Default: development
${indexerList}
  --help, -h         Show this help message

Examples:
  node start-rumble-dev.js --all
  node start-rumble-dev.js --eth
  node start-rumble-dev.js --eth --usdt-eth --btc
  node start-rumble-dev.js --ton --usdt-ton
  node start-rumble-dev.js --all --env production
  node start-rumble-dev.js --eth --env staging

Note: Core workers (data shard, ORK, HTTP) always start regardless of indexer selection.
`)
}

// Determine which indexers to start
function getSelectedIndexers(selected) {
  if (selected.help) {
    return null
  }

  if (selected.all) {
    return Object.keys(WORKERS.indexers)
  }

  const indexers = []
  for (const key in WORKERS.indexers) {
    if (selected[key]) {
      indexers.push(key)
    }
  }

  return indexers
}


// Build worker command
function buildWorkerCommand(worker, rpcKey = null, env = 'development') {
  const cmd = ['node', 'worker.js', '--wtype', worker.wtype, '--env', env]

  if (worker.rack) {
    cmd.push('--rack', worker.rack)
  }

  if (worker.chain) {
    cmd.push('--chain', worker.chain)
  }

  if (worker.port) {
    cmd.push('--port', worker.port.toString())
  }

  if (rpcKey) {
    cmd.push('--proc-rpc', rpcKey)
  }

  return cmd
}

// Start worker in separate terminal
function startWorkerInTerminal(worker, title, rpcKey = null, env = 'development') {
  const platform = process.platform
  const workerCmd = buildWorkerCommand(worker, rpcKey, env)
  const workerCmdStr = workerCmd.join(' ')

  console.log(`Starting ${title}...`)

  if (platform === 'win32') {
    // Windows: Use cmd /k to open new window
    // Build the command that will execute in the new window
    const cdCmd = `cd /d "${worker.dir}"`
    const echoCmd = `echo ${worker.description} && echo.`
    const fullCmd = `${cdCmd} && ${echoCmd} && ${workerCmdStr}`
    
    // For Windows start command, we need to properly escape quotes
    // The format is: start "Title" cmd /k "command"
    // Quotes inside the command need to be doubled for cmd
    const escapedCmd = fullCmd.replace(/"/g, '""')
    
    // Use exec to run the start command
    // This is more reliable than spawn for Windows start commands
    exec(`start "${title}" cmd /k "${escapedCmd}"`, {
      detached: true,
      stdio: 'ignore'
    }, (error) => {
      if (error) {
        console.error(`Failed to start ${title}:`, error.message)
      }
    })
  } else if (platform === 'darwin') {
    // macOS: Use osascript to open Terminal
    // Escape single quotes in paths and descriptions for shell
    const escapedDir = worker.dir.replace(/'/g, "'\\''")
    const escapedDesc = worker.description.replace(/'/g, "'\\''")
    const cdCmd = `cd '${escapedDir}'`
    const echoCmd = `echo '${escapedDesc}' && echo`
    const fullCmd = `${cdCmd} && ${echoCmd} && ${workerCmdStr}`
    
    // Escape for AppleScript: escape backslashes and quotes
    const appleScriptCmd = fullCmd
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/"/g, '\\"')    // Escape double quotes
    
    const osascript = spawn('osascript', [
      '-e',
      `tell application "Terminal" to do script "${appleScriptCmd}"`
    ], {
      detached: true,
      stdio: 'ignore'
    })
    
    osascript.on('error', (err) => {
      console.error(`Failed to start ${title} on macOS:`, err.message)
      console.error('Make sure Terminal.app is available and you have granted necessary permissions.')
    })
  } else {
    // Linux: Try to find and use available terminal
    // Escape single quotes in paths and descriptions for bash
    const escapedDir = worker.dir.replace(/'/g, "'\\''")
    const escapedDesc = worker.description.replace(/'/g, "'\\''")
    const cdCmd = `cd '${escapedDir}'`
    const echoCmd = `echo '${escapedDesc}' && echo`
    const fullCmd = `${cdCmd} && ${echoCmd} && ${workerCmdStr}`
    
    // Try terminals in order of preference
    const terminals = [
      { 
        cmd: 'gnome-terminal', 
        args: ['--title', title, '--', 'bash', '-c', `${fullCmd}; exec bash`],
        check: 'which gnome-terminal'
      },
      { 
        cmd: 'xterm', 
        args: ['-T', title, '-e', 'bash', '-c', `${fullCmd}; exec bash`],
        check: 'which xterm'
      },
      { 
        cmd: 'konsole', 
        args: ['-e', 'bash', '-c', `${fullCmd}; exec bash`],
        check: 'which konsole'
      },
      {
        cmd: 'alacritty',
        args: ['-e', 'bash', '-c', `${fullCmd}; exec bash`],
        check: 'which alacritty'
      },
      {
        cmd: 'terminator',
        args: ['-e', `bash -c '${fullCmd}; exec bash'`],
        check: 'which terminator'
      }
    ]

    let termFound = false
    for (const term of terminals) {
      try {
        require('child_process').execSync(term.check, { stdio: 'ignore' })
        const termProc = spawn(term.cmd, term.args, {
          detached: true,
          stdio: 'ignore'
        })
        termProc.on('error', (err) => {
          if (!termFound) {
            console.warn(`Warning: ${term.cmd} failed: ${err.message}`)
          }
        })
        termFound = true
        break
      } catch {
        // Try next terminal
      }
    }

    if (!termFound) {
      console.error(`Error: No suitable terminal found. Please install one of:`)
      console.error('  - gnome-terminal (GNOME)')
      console.error('  - xterm (X11)')
      console.error('  - konsole (KDE)')
      console.error('  - alacritty (cross-platform)')
      console.error('  - terminator (GTK)')
      process.exit(1)
    }
  }
}

// Capture RPC key from processor worker
function captureRpcKey(worker, timeout = 15000, env = 'development') {
  return new Promise((resolve, reject) => {
    const workerCmd = buildWorkerCommand(worker, null, env)
    let output = ''
    let rpcKey = null
    let rpcKeyFound = false

    console.log(`Capturing RPC key from ${worker.description}...`)

    const proc = spawn('node', ['worker.js', ...workerCmd.slice(1)], {
      cwd: worker.dir,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    const timeoutId = setTimeout(() => {
      if (!rpcKeyFound) {
        proc.kill()
        reject(new Error(`Timeout: RPC key not found within ${timeout}ms`))
      }
    }, timeout)

    proc.stdout.on('data', (data) => {
      const text = data.toString()
      output += text

      // Look for RPC public key
      const match = text.match(/rpc public key:\s*([a-fA-F0-9]{64})/i)
      if (match && !rpcKeyFound) {
        rpcKey = match[1]
        rpcKeyFound = true
        clearTimeout(timeoutId)
        proc.kill()
        console.log(`✓ RPC key captured: ${rpcKey.substring(0, 16)}...`)
        resolve(rpcKey)
      }
    })

    proc.stderr.on('data', (data) => {
      const text = data.toString()
      output += text

      // Also check stderr for RPC key
      if (!rpcKeyFound) {
        const match = text.match(/rpc public key:\s*([a-fA-F0-9]{64})/i)
        if (match) {
          rpcKey = match[1]
          rpcKeyFound = true
          clearTimeout(timeoutId)
          proc.kill()
          console.log(`✓ RPC key captured: ${rpcKey.substring(0, 16)}...`)
          resolve(rpcKey)
        }
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timeoutId)
      reject(err)
    })

    proc.on('exit', () => {
      if (!rpcKeyFound) {
        // Try to find RPC key in accumulated output
        const match = output.match(/rpc public key:\s*([a-fA-F0-9]{64})/i)
        if (match) {
          rpcKey = match[1]
          rpcKeyFound = true
          clearTimeout(timeoutId)
          console.log(`✓ RPC key found in output: ${rpcKey.substring(0, 16)}...`)
          resolve(rpcKey)
        } else {
          clearTimeout(timeoutId)
          reject(new Error('RPC key not found in worker output'))
        }
      }
    })
  })
}

// Main execution
async function main() {
  const selected = parseArgs()

  if (selected.help) {
    showHelp()
    process.exit(0)
  }

  const indexers = getSelectedIndexers(selected)

  if (!indexers || indexers.length === 0) {
    console.error('Error: No indexers selected. Use --all or specify individual indexers.')
    console.error('Available indexers:', Object.keys(WORKERS.indexers).join(', '))
    console.error('Use --help for usage information.')
    process.exit(1)
  }

  const env = selected.env

  console.log('Starting Rumble Development Environment...')
  console.log(`Environment: ${env}`)
  console.log(`Selected indexers: ${indexers.join(', ')}`)
  console.log('')

  // Phase 1: Capture RPC keys and start workers immediately as keys are captured
  console.log('Phase 1: Capturing RPC keys and starting indexer workers...')
  const rpcKeys = {}

  // Start all processor workers in parallel and start API workers immediately when keys are captured
  const procPromises = []

  // Indexer processors - start API workers immediately when RPC key is captured
  for (const indexerId of indexers) {
    const indexer = WORKERS.indexers[indexerId]
    if (!indexer) continue

    procPromises.push(
      (async () => {
        try {
          const key = await captureRpcKey(indexer.proc, 15000, env)
          rpcKeys[indexerId] = key
          
          // Immediately start processor in terminal
          startWorkerInTerminal(
            indexer.proc,
            `${indexer.name} Indexer Processor`,
            null,
            env
          )

          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500))

          // Start API worker with captured RPC key
          startWorkerInTerminal(
            indexer.api,
            `${indexer.name} Indexer API`,
            key,
            env
          )
        } catch (err) {
          console.error(`✗ Failed to capture RPC key for ${indexer.name}: ${err.message}`)
          console.error(`⚠ Starting ${indexer.name} Processor anyway - you may need to manually start the API worker`)
          rpcKeys[indexerId] = null
          
          // Still start the processor worker even if RPC key capture failed
          startWorkerInTerminal(
            indexer.proc,
            `${indexer.name} Indexer Processor`,
            null,
            env
          )
        }
      })()
    )
  }

  // Data shard processor
  procPromises.push(
    captureRpcKey(WORKERS.core.dataShardProc, 15000, env)
      .then(key => {
        rpcKeys.dataShard = key
      })
      .catch(err => {
        console.error(`✗ Failed to capture RPC key for Data Shard Processor: ${err.message}`)
        console.error(`⚠ Data Shard Processor will still start, but API worker will be skipped`)
        rpcKeys.dataShard = null
      })
  )

  // Wait for all RPC keys to be captured (or fail)
  await Promise.all(procPromises)

  console.log('')
  console.log('Phase 2: Starting core workers...')
  console.log('')

  // Phase 2: Start core workers

  // Start data shard processor
  startWorkerInTerminal(
    WORKERS.core.dataShardProc,
    WORKERS.core.dataShardProc.name,
    null,
    env
  )

  await new Promise(resolve => setTimeout(resolve, 500))

  // Start data shard API (if we have RPC key)
  if (rpcKeys.dataShard) {
    startWorkerInTerminal(
      WORKERS.core.dataShardApi,
      WORKERS.core.dataShardApi.name,
      rpcKeys.dataShard,
      env
    )
  } else {
    console.error('⚠ Skipping Data Shard API worker - no RPC key available')
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  // Start ORK and HTTP in parallel (they're independent)
  startWorkerInTerminal(
    WORKERS.core.ork,
    WORKERS.core.ork.name,
    null,
    env
  )

  startWorkerInTerminal(
    WORKERS.core.http,
    WORKERS.core.http.name,
    null,
    env
  )

  console.log('')
  console.log('✓ All workers started!')
  console.log('')
  console.log('IMPORTANT NOTES:')
  console.log('1. Indexers start FIRST so their topics are available when data shard workers need them')
  console.log('2. Make sure Redis is running on port 6379 for the HTTP worker')
  console.log('3. If you see connection errors, check that Redis is running')
  console.log('4. Each worker runs in its own terminal window - close the window to stop that worker')
  console.log('5. Initial ERR_TOPIC_LOOKUP_EMPTY errors are normal until all indexers finish starting up')
  console.log('')
}

// Run main function
main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

