import { getShortLink } from 'git-links'
import { Collector } from '../types'

const gitlabCI: Collector = {
  name: 'GitLab CI',

  testEnvironment () {
    return Promise.resolve(Boolean(process.env.CI && process.env.GITLAB_CI))
  },

  async collect () {
    return {
      'ci': 'true',
      'repo:branch': process.env['CI_COMMIT_REF_NAME'],
      'repo:commitmsg': process.env['CI_COMMIT_TITLE'],
      'repo:origin': process.env['CI_REPOSITORY_URL'] ? getShortLink(process.env['CI_REPOSITORY_URL'] as string) : undefined,
      'repo:revision': process.env['CI_COMMIT_SHA'],
      'repo:tag': process.env['CI_COMMIT_TAG']
    }
  }
}

export default gitlabCI
