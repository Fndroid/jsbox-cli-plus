import chalk from 'chalk'
import { getHost, setHost } from './config'
import * as log from './log'
import { zipFolder, tryCatch, isPackageDir, getPackageName } from './utils'
import * as fs from 'fs'
import { tmpdir } from 'os'
import { join, resolve, basename } from 'path'
import * as chokidar from 'chokidar'
import * as _ from 'lodash'
import * as got from 'got'
import * as FormData from 'form-data'
import { spawn } from 'child_process'

export function showHost () {
  const ip = getHost()
  if (!ip) {
    log.warn('Host IP has not been set up yet')
    return
  }
  console.log(`${chalk.greenBright(`Your Host IP:`)} ${ip}`)
}

export const sync = _.debounce(async (isdir, path, host, packageName) => {
  log.info('File changed, uploading...')
  const formData = new FormData()
  if (isdir) {
    path = await zipFolder(path, join(tmpdir(), `${packageName}.box`))
  }
  formData.append('files[]', fs.createReadStream(path))

  const [, err] = await tryCatch(got.post(`http://${host}/upload`, {
    body: formData,
    timeout: 5000
  }))
  if (err) {
    log.error(err.message)
    return
  }
  log.info('🎉 Update success!')
}, 100)

export function watch (file: string, startlogger?: boolean) {

  const host = getHost()
  if (!host) {
    log.error('Host IP has not been set up yet')
    process.exit(1)
  }

  if (!fs.existsSync(file)) {
    log.error(`${file} not exists`)
  }

  log.info(`Your current Host IP: ${host}`)
  const isDir = fs.statSync(file).isDirectory()

  let packageName = basename(file)
  if (isDir) {
    if (!isPackageDir(file)) {
      log.error(`${file} is not a package!`)
      process.exit(1)
    }

    packageName = getPackageName(file)
    if (!packageName) {
      log.error('Package must have a name!')
      process.exit(1)
    }
  }

  if (startlogger) {
    setupLogger(isDir, file)
  }

  chokidar.watch(file, { ignoreInitial: true })
    .on('all', async () => {
      await sync(isDir, file, host, packageName)
    })
}

function setupLogger (isDir: boolean, file: string) {
  let logger = spawn('jsbox-logger', [], {
    shell: true
  })
  logger.stdout.on('data', data => {
    let msg = data.toString()
    addLoggerCode(msg, isDir ? 'main.js' : file)
    console.log(chalk.greenBright(msg))
  })
}

function addLoggerCode (msg: string, file?: string) {
  let mainJS = fs.readFileSync(file).toString()
  if (/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):/.test(msg) && !/\/\/\sSocketLogger\sAuto\sGeneration\sCode/.test(mainJS)) {
    let debugConf = `let socketLogger = require("socketLogger")\ntypeof socketLogger.init === 'function' && socketLogger.init('${RegExp.$1}')\n// SocketLogger Auto Generation Code`
    fs.writeFileSync(file, `${debugConf}\n\n${mainJS}`)
    log.info('SocketLogger init code had been added!')
  }
}

export function saveHost (host: string) {
  setHost(host)
  log.info(`Save your host ${host} to the config`)
}

export async function build (path: string, ouputPath?: string) {
  if (!fs.existsSync(path)) {
    log.error(`${path} is not exist`)
    process.exit(1)
  }

  if (!fs.statSync(path).isDirectory()) {
    log.error(`${path} is not a directory`)
    process.exit(1)
  }

  if (!isPackageDir(path)) {
    log.error(`${path} is not a package directory`)
    process.exit(1)
  }

  const packageName = getPackageName(path)
  if (!packageName) {
    log.error('Package must have a name!')
    process.exit(1)
  }

  let mainJS = fs.readFileSync('main.js').toString()
  fs.writeFileSync('main.js', mainJS.replace(/^[\s\S]*?\/\/\sSocketLogger\sAuto\sGeneration\sCode[\r\n]*/, ''))

  ouputPath = !ouputPath
    ? ouputPath = resolve(path, `.output/${packageName}.box`)
    : ouputPath = resolve(process.cwd(), ouputPath)

  await zipFolder(path, ouputPath)
  log.info(`Build in ${ouputPath}`)
}
