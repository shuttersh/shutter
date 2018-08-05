import { getShortLink } from 'git-links'
import { Collector } from '../types'

const jenkinsCI: Collector = {
  name: 'Jenkins CI',

  testEnvironment () {
    return Promise.resolve(Boolean(process.env.JENKINS_URL))
  },

  async collect () {
    return {
      'ci': 'true',
      'repo:branch': process.env.GIT_BRANCH,
      'repo:origin': process.env.GIT_URL ? getShortLink(process.env.GIT_URL) : undefined,
      'repo:revision': process.env.GIT_COMMIT
    }
  }
}

export default jenkinsCI
