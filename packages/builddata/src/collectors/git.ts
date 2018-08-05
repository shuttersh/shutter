import createDebugLogger from 'debug'
import { getShortLink } from 'git-links'
import { canUseGit, queryBranchName, queryRemoteURL, queryTagName, queryRevision } from '../git'
import { Collector } from '../types'

const debug = createDebugLogger('shutter:builddata:git')

async function tryTo<T> (fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    debug(`Git collector query failed. Not setting the value. Error:`, error.stack)
    return null
  }
}

const git: Collector = {
  name: 'Git',

  testEnvironment (dirPath: string) {
    return canUseGit(dirPath)
  },

  async collect (dirPath) {
    const [remoteURL, branchName, revision, tagName] = await Promise.all([
      tryTo(() => queryRemoteURL(dirPath)),
      tryTo(() => queryBranchName(dirPath)),
      tryTo(() => queryRevision(dirPath)),
      tryTo(() => queryTagName(dirPath))
    ])
    return {
      'repo:origin': remoteURL ? getShortLink(remoteURL) : undefined,
      'repo:branch': branchName || undefined,
      'repo:revision': revision || undefined,
      'repo:tag': tagName || undefined
    }
  }
}

export default git
