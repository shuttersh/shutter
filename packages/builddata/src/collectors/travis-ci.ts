import { Collector } from '../types'

const travisCI: Collector = {
  name: 'Travis CI',

  testEnvironment () {
    return Promise.resolve(Boolean(process.env.CI && process.env.TRAVIS))
  },

  async collect () {
    return {
      'repo:branch': process.env['TRAVIS_BRANCH'],
      'repo:commitmsg': process.env['TRAVIS_COMMIT_MESSAGE'],
      'repo:origin': process.env['TRAVIS_REPO_SLUG'] ? `github:${process.env['TRAVIS_REPO_SLUG']}` : undefined,
      'repo:pullreq': process.env['TRAVIS_PULL_REQUEST'],
      'repo:revision': process.env['TRAVIS_COMMIT'],
      'repo:tag': process.env['TRAVIS_TAG']
    }
  }
}

export default travisCI
