import { Collector } from '../types'

const circleCI: Collector = {
  name: 'Circle CI',

  testEnvironment () {
    return Promise.resolve(Boolean(process.env.CI && process.env.CIRCLE_JOB))
  },

  async collect () {
    return {
      'repo:branch': process.env.CIRCLE_BRANCH,
      'repo:pullreq': process.env.CIRCLE_PR_NUMBER,
      'repo:revision': process.env.CIRCLE_SHA1,
      'repo:tag': process.env.CIRCLE_TAG
    }
  }
}

export default circleCI
