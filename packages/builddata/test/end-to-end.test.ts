import test from 'ava'
import execa from 'execa'
import * as fs from 'fs'
import * as path from 'path'
import * as tmp from 'tmp'
import { promisify } from 'util'
import { collectMetadata, CollectedMetadata } from '../src/index'
import { withEnvironment } from './helpers/environment'

const writeFile = promisify(fs.writeFile)

test.serial('can retrieve metadata from GitHub repo with package.json on master', async t => {
  const dirPath = tmp.dirSync().name

  await execa.shell('git init . && git remote add origin git@github.com:octocat/Hello-World.git', { cwd: dirPath })
  await writeFile(path.join(dirPath, 'package.json'), '{ "name": "hello-world" }', 'utf8')
  await execa.shell('git add . && git commit -m "initial commit"', { cwd: dirPath })

  const metadata = await collectMetadata(dirPath)

  if (typeof metadata['repo:revision'] !== 'string') return t.fail(`repo:revision should be of type string, but is ${typeof metadata['repo:revision']}`)
  t.regex(metadata['repo:revision'] as string, /^[0-9a-f]+$/)

  t.deepEqual(metadata, {
    'package:name': 'hello-world',
    'repo:branch': 'master',
    'repo:origin': 'github:octocat/Hello-World',
    'repo:revision': metadata['repo:revision']
  } as CollectedMetadata)
})

test.serial('can retrieve metadata in Travis CI env', async t => {
  const envVars = {
    CI: 'true',
    TRAVIS: 'true',
    TRAVIS_BRANCH: 'feature/1-do-stuff',
    TRAVIS_COMMIT: '1234ef',
    TRAVIS_COMMIT_MESSAGE: 'Test commit',
    TRAVIS_PULL_REQUEST: '1',
    TRAVIS_REPO_SLUG: 'octocat/Hello-World',
    TRAVIS_TAG: 'v0.0.0'
  }

  const metadata = await withEnvironment(envVars, async () => {
    const dirPath = tmp.dirSync().name
    return collectMetadata(dirPath)
  })

  t.deepEqual(metadata, {
    'ci': 'true',
    'repo:branch': 'feature/1-do-stuff',
    'repo:commitmsg': 'Test commit',
    'repo:origin': 'github:octocat/Hello-World',
    'repo:pullreq': '1',
    'repo:revision': '1234ef',
    'repo:tag': 'v0.0.0'
  } as CollectedMetadata)
})

test.serial('can retrieve metadata from GitLab env', async t => {
  const envVars = {
    CI: 'true',
    GITLAB_CI: 'true',
    CI_COMMIT_REF_NAME: 'feature/1-do-stuff',
    CI_COMMIT_SHA: '1234ef',
    CI_COMMIT_TAG: 'v0.0.0',
    CI_COMMIT_TITLE: 'Test commit',
    CI_REPOSITORY_URL: 'git@gitlab.com:gitlab-org/gitlab-ce.git'
  }

  const metadata = await withEnvironment(envVars, async () => {
    const dirPath = tmp.dirSync().name
    return collectMetadata(dirPath)
  })

  t.deepEqual(metadata, {
    'ci': 'true',
    'repo:branch': 'feature/1-do-stuff',
    'repo:commitmsg': 'Test commit',
    'repo:origin': 'gitlab:gitlab-org/gitlab-ce',
    'repo:revision': '1234ef',
    'repo:tag': 'v0.0.0'
  } as CollectedMetadata)
})

test.serial('can retrieve metadata from Circle CI env', async t => {
  const envVars = {
    CI: 'true',
    CIRCLECI: 'true',
    CIRCLE_BRANCH: 'feature/1-do-stuff',
    CIRCLE_PULL_REQUEST: 'https://github.com/octocat/Hello-World/pull/1',
    CIRCLE_PR_NUMBER: '1',
    CIRCLE_REPOSITORY_URL: 'git@github.com:octocat/Hello-World.git',
    CIRCLE_SHA1: '1234ef',
    CIRCLE_TAG: 'v0.0.0'
  }

  const metadata = await withEnvironment(envVars, async () => {
    const dirPath = tmp.dirSync().name
    return collectMetadata(dirPath)
  })

  t.deepEqual(metadata, {
    'ci': 'true',
    'repo:branch': 'feature/1-do-stuff',
    'repo:origin': 'github:octocat/Hello-World',
    'repo:pullreq': '1',
    'repo:revision': '1234ef',
    'repo:tag': 'v0.0.0'
  } as CollectedMetadata)
})

test.serial('can retrieve metadata from Jenkins CI env', async t => {
  const envVars = {
    JENKINS_URL: 'https://jenkins.example.com/',
    GIT_BRANCH: 'feature/1-do-stuff',
    GIT_COMMIT: '1234ef',
    GIT_URL: 'git@github.com:octocat/Hello-World.git'
  }

  const metadata = await withEnvironment(envVars, async () => {
    const dirPath = tmp.dirSync().name
    return collectMetadata(dirPath)
  })

  t.deepEqual(metadata, {
    'ci': 'true',
    'repo:branch': 'feature/1-do-stuff',
    'repo:origin': 'github:octocat/Hello-World',
    'repo:revision': '1234ef'
  } as CollectedMetadata)
})
