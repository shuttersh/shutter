import test from 'ava'
import execa from 'execa'
import * as fs from 'fs'
import * as path from 'path'
import * as tmp from 'tmp'
import { promisify } from 'util'
import { collectMetadata, CollectedMetadata } from '../src/index'

const writeFile = promisify(fs.writeFile)

test('can retrieve metadata from GitHub repo in Travis CI env with package.json on master', async t => {
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

test.todo('can retrieve metadata from GitLab repo in GitLab env, just committed & tagged')
test.todo('can retrieve metadata from BitBucket repo in Circle CI env')
test.todo('can retrieve metadata when not in a git repo, in Jenkins CI env')
