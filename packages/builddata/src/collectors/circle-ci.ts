import { getShortLink } from 'git-links'
import { Collector } from '../types'

// TODO: This should rather go into `git-links`
const pullRequestRegExps = [
  /\/pull\/([0-9]+)/,
  /\/pull-requests\/([0-9]+)/,
  /\/merge_requests\/([0-9]+)/
]

function getPullReqNo (gitURL: string) {
  for (const urlRegex of pullRequestRegExps) {
    const matches = gitURL.match(urlRegex)
    if (matches) return matches[1]
  }

  return null
}

const circleCI: Collector = {
  name: 'Circle CI',

  testEnvironment () {
    return Promise.resolve(Boolean(process.env.CI && process.env.CIRCLECI))
  },

  async collect () {
    return {
      'repo:branch': process.env.CIRCLE_BRANCH,
      'repo:origin': process.env.CIRCLE_REPOSITORY_URL ? getShortLink(process.env.CIRCLE_REPOSITORY_URL) : undefined,
      'repo:pullreq': (process.env.CIRCLE_PULL_REQUEST ? getPullReqNo(process.env.CIRCLE_PULL_REQUEST) : process.env.CIRCLE_PR_NUMBER) || undefined,
      'repo:revision': process.env.CIRCLE_SHA1,
      'repo:tag': process.env.CIRCLE_TAG
    }
  }
}

export default circleCI
