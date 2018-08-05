import createDebugLogger from 'debug'
import execa from 'execa'

const debug = createDebugLogger('shutter:builddata:git')

export async function canUseGit (dirPath: string) {
  try {
    const { stdout } = await execa('git', ['config', '--get', 'core.bare'], { cwd: dirPath })
    return stdout.trim().length > 0
  } catch (error) {
    debug(`Cannot use git in ${dirPath}. Reason: ${error.stack}`)
    return false
  }
}

export async function queryBranchName (dirPath: string) {
  const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: dirPath })
  const branchName = stdout.trim()
  return branchName !== 'HEAD' ? branchName : null
}

export async function queryRemoteURL (dirPath: string) {
  const { stdout } = await execa('git', ['config', '--get', 'remote.origin.url'], { cwd: dirPath })
  return stdout.trim()
}

export async function queryRevision (dirPath: string) {
  const { stdout } = await execa('git', ['rev-parse', 'HEAD'], { cwd: dirPath })
  return stdout.trim()
}

export async function queryTagName (dirPath: string) {
  try {
    const { stdout } = await execa('git', ['describe', '--tags', '--exact-match'], { cwd: dirPath })
    return stdout.trim()
  } catch {
    return null
  }
}
